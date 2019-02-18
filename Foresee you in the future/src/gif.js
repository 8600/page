  // https://github.com/deanm/omggif
  
  function GifReader(buf) {
    var p = 0;
  
    // - Header (GIF87a or GIF89a).
    if (buf[p++] !== 0x47 ||            buf[p++] !== 0x49 || buf[p++] !== 0x46 ||
        buf[p++] !== 0x38 || (buf[p++]+1 & 0xfd) !== 0x38 || buf[p++] !== 0x61) {
          alert('资源加载失败!')
      throw new Error("Invalid GIF 87a/89a header.");
    }
  
    // - Logical Screen Descriptor.
    var width = buf[p++] | buf[p++] << 8;
    var height = buf[p++] | buf[p++] << 8;
    var pf0 = buf[p++];  // <Packed Fields>.
    var global_palette_flag = pf0 >> 7;
    var num_global_colors_pow2 = pf0 & 0x7;
    var num_global_colors = 1 << (num_global_colors_pow2 + 1);
    var background = buf[p++];
    buf[p++];  // Pixel aspect ratio (unused?).
  
    var global_palette_offset = null;
    var global_palette_size   = null;
  
    if (global_palette_flag) {
      global_palette_offset = p;
      global_palette_size = num_global_colors;
      p += num_global_colors * 3;  // Seek past palette.
    }
  
    var no_eof = true;
  
    var frames = [ ];
  
    var delay = 0;
    var transparent_index = null;
    var disposal = 0;  // 0 - No disposal specified.
    var loop_count = null;
  
    this.width = width;
    this.height = height;
  
    while (no_eof && p < buf.length) {
      switch (buf[p++]) {
        case 0x21:  // Graphics Control Extension Block
          switch (buf[p++]) {
            case 0xff:  // Application specific block
              // Try if it's a Netscape block (with animation loop counter).
              if (buf[p   ] !== 0x0b ||  // 21 FF already read, check block size.
                  // NETSCAPE2.0
                  buf[p+1 ] == 0x4e && buf[p+2 ] == 0x45 && buf[p+3 ] == 0x54 &&
                  buf[p+4 ] == 0x53 && buf[p+5 ] == 0x43 && buf[p+6 ] == 0x41 &&
                  buf[p+7 ] == 0x50 && buf[p+8 ] == 0x45 && buf[p+9 ] == 0x32 &&
                  buf[p+10] == 0x2e && buf[p+11] == 0x30 &&
                  // Sub-block
                  buf[p+12] == 0x03 && buf[p+13] == 0x01 && buf[p+16] == 0) {
                p += 14;
                loop_count = buf[p++] | buf[p++] << 8;
                p++;  // Skip terminator.
              } else {  // We don't know what it is, just try to get past it.
                p += 12;
                while (true) {  // Seek through subblocks.
                  var block_size = buf[p++];
                  // Bad block size (ex: undefined from an out of bounds read).
                  if (!(block_size >= 0)) throw Error("Invalid block size");
                  if (block_size === 0) break;  // 0 size is terminator
                  p += block_size;
                }
              }
              break;
  
            case 0xf9:  // Graphics Control Extension
              if (buf[p++] !== 0x4 || buf[p+4] !== 0)
                throw new Error("Invalid graphics extension block.");
              var pf1 = buf[p++];
              delay = buf[p++] | buf[p++] << 8;
              transparent_index = buf[p++];
              if ((pf1 & 1) === 0) transparent_index = null;
              disposal = pf1 >> 2 & 0x7;
              p++;  // Skip terminator.
              break;
  
            case 0xfe:  // Comment Extension.
              while (true) {  // Seek through subblocks.
                var block_size = buf[p++];
                // Bad block size (ex: undefined from an out of bounds read).
                if (!(block_size >= 0)) throw Error("Invalid block size");
                if (block_size === 0) break;  // 0 size is terminator
                // console.log(buf.slice(p, p+block_size).toString('ascii'));
                p += block_size;
              }
              break;
  
            default:
              throw new Error(
                  "Unknown graphic control label: 0x" + buf[p-1].toString(16));
          }
          break;
  
        case 0x2c:  // Image Descriptor.
          var x = buf[p++] | buf[p++] << 8;
          var y = buf[p++] | buf[p++] << 8;
          var w = buf[p++] | buf[p++] << 8;
          var h = buf[p++] | buf[p++] << 8;
          var pf2 = buf[p++];
          var local_palette_flag = pf2 >> 7;
          var interlace_flag = pf2 >> 6 & 1;
          var num_local_colors_pow2 = pf2 & 0x7;
          var num_local_colors = 1 << (num_local_colors_pow2 + 1);
          var palette_offset = global_palette_offset;
          var palette_size = global_palette_size;
          var has_local_palette = false;
          if (local_palette_flag) {
            var has_local_palette = true;
            palette_offset = p;  // Override with local palette.
            palette_size = num_local_colors;
            p += num_local_colors * 3;  // Seek past palette.
          }
  
          var data_offset = p;
  
          p++;  // codesize
          while (true) {
            var block_size = buf[p++];
            // Bad block size (ex: undefined from an out of bounds read).
            if (!(block_size >= 0)) throw Error("Invalid block size");
            if (block_size === 0) break;  // 0 size is terminator
            p += block_size;
          }
  
          frames.push({x: x, y: y, width: w, height: h,
                       has_local_palette: has_local_palette,
                       palette_offset: palette_offset,
                       palette_size: palette_size,
                       data_offset: data_offset,
                       data_length: p - data_offset,
                       transparent_index: transparent_index,
                       interlaced: !!interlace_flag,
                       delay: delay,
                       disposal: disposal});
          break;
  
        case 0x3b:  // Trailer Marker (end of file).
          no_eof = false;
          break;
  
        default:
          throw new Error("Unknown gif block: 0x" + buf[p-1].toString(16));
          break;
      }
    }
  
    this.numFrames = function() {
      return frames.length;
    };
  
    this.loopCount = function() {
      return loop_count;
    };
  
    this.frameInfo = function(frame_num) {
      if (frame_num < 0 || frame_num >= frames.length)
        throw new Error("Frame index out of range.");
      return frames[frame_num];
    }
  
    // I will go to copy and paste hell one day...
    this.decodeAndBlitFrameRGBA = function(frame_num, pixels) {
      var frame = this.frameInfo(frame_num)
      // 计算出总像素点数量
      var num_pixels = frame.width * frame.height
      // 创建像素点值
      var index_stream = new Uint8Array(num_pixels)  // At most 8-bit indices.
      GifReaderLZWOutputIndexStream(buf, frame.data_offset, index_stream, num_pixels);
      // console.log(index_stream)
      var palette_offset = frame.palette_offset;
  
      // 计算出空像素点值
      var trans = frame.transparent_index;
      if (trans === null) trans = 256;
  
      // We are possibly just blitting to a portion of the entire frame.
      // That is a subrect within the framerect, so the additional pixels
      // must be skipped over after we finished a scanline.
      var framewidth  = frame.width;
      var framestride = width - framewidth;
      var xleft       = framewidth;  // Number of subrect pixels left in scanline.
  
      // Output indicies of the top left and bottom right corners of the subrect.
      var opbeg = ((frame.y * width) + frame.x) * 4;
      var opend = ((frame.y + frame.height) * width + frame.x) * 4;
      var op    = opbeg;
  
      var scanstride = framestride * 4;
  
      // Use scanstride to skip past the rows when interlacing.  This is skipping
      // 7 rows for the first two passes, then 3 then 1.
      if (frame.interlaced === true) {
        scanstride += width * 4 * 7;  // Pass 1.
      }
  
      var interlaceskip = 8;  // Tracking the row interval in the current pass.
  
      for (var i = 0, il = index_stream.length; i < il; ++i) {
        var index = index_stream[i];
  
        if (xleft === 0) {  // Beginning of new scan line
          op += scanstride;
          xleft = framewidth;
          if (op >= opend) { // Catch the wrap to switch passes when interlacing.
            scanstride = framestride * 4 + width * 4 * (interlaceskip-1);
            // interlaceskip / 2 * 4 is interlaceskip << 1.
            op = opbeg + (framewidth + framestride) * (interlaceskip << 1);
            interlaceskip >>= 1;
          }
        }
        // console.log(index, trans)
        if (index === trans) {
          op += 4;
        } else {
          var r = buf[palette_offset + index * 3];
          var g = buf[palette_offset + index * 3 + 1];
          var b = buf[palette_offset + index * 3 + 2];
          pixels[op++] = r;
          pixels[op++] = g;
          pixels[op++] = b;
          pixels[op++] = 255;
        }
        --xleft;
      }
    };
  }
  
  function GifReaderLZWOutputIndexStream(code_stream, p, output, output_length) {
    
    var min_code_size = code_stream[p++];
    
    var clear_code = 1 << min_code_size;
    var eoi_code = clear_code + 1;
    var next_code = eoi_code + 1;
  
    var cur_code_size = min_code_size + 1;  // Number of bits per code.
    // NOTE: This shares the same name as the encoder, but has a different
    // meaning here.  Here this masks each code coming from the code stream.
    var code_mask = (1 << cur_code_size) - 1;
    var cur_shift = 0;
    var cur = 0;
  
    var op = 0;  // Output pointer.
  
    var subblock_size = code_stream[p++];
    // TODO(deanm): Would using a TypedArray be any faster?  At least it would
    // solve the fast mode / backing store uncertainty.
    // var code_table = Array(4096);
    var code_table = new Int32Array(4096);  // Can be signed, we only use 20 bits.
  
    var prev_code = null;  // Track code-1.
  
    while (true) {
      // Read up to two bytes, making sure we always 12-bits for max sized code.
      while (cur_shift < 16) {
        if (subblock_size === 0) break;  // No more data to be read.
  
        cur |= code_stream[p++] << cur_shift;
        cur_shift += 8;
  
        if (subblock_size === 1) {  // Never var it get to 0 to hold logic above.
          subblock_size = code_stream[p++];  // Next subblock.
        } else {
          --subblock_size;
        }
      }
  
      // TODO(deanm): We should never really get here, we should have received
      // and EOI.
      if (cur_shift < cur_code_size)
        break;
  
      var code = cur & code_mask;
      cur >>= cur_code_size;
      cur_shift -= cur_code_size;
  
      // TODO(deanm): Maybe should check that the first code was a clear code,
      // at least this is what you're supposed to do.  But actually our encoder
      // now doesn't emit a clear code first anyway.
      if (code === clear_code) {
        // We don't actually have to clear the table.  This could be a good idea
        // for greater error checking, but we don't really do any anyway.  We
        // will just track it with next_code and overwrite old entries.
  
        next_code = eoi_code + 1;
        cur_code_size = min_code_size + 1;
        code_mask = (1 << cur_code_size) - 1;
  
        // Don't update prev_code ?
        prev_code = null;
        continue;
      } else if (code === eoi_code) {
        break;
      }
  
      // We have a similar situation as the decoder, where we want to store
      // variable length entries (code table entries), but we want to do in a
      // faster manner than an array of arrays.  The code below stores sort of a
      // linked list within the code table, and then "chases" through it to
      // construct the dictionary entries.  When a new entry is created, just the
      // last byte is stored, and the rest (prefix) of the entry is only
      // referenced by its table entry.  Then the code chases through the
      // prefixes until it reaches a single byte code.  We have to chase twice,
      // first to compute the length, and then to actually copy the data to the
      // output (backwards, since we know the length).  The alternative would be
      // storing something in an intermediate stack, but that doesn't make any
      // more sense.  I implemented an approach where it also stored the length
      // in the code table, although it's a bit tricky because you run out of
      // bits (12 + 12 + 8), but I didn't measure much improvements (the table
      // entries are generally not the long).  Even when I created benchmarks for
      // very long table entries the complexity did not seem worth it.
      // The code table stores the prefix entry in 12 bits and then the suffix
      // byte in 8 bits, so each entry is 20 bits.
  
      var chase_code = code < next_code ? code : prev_code;
  
      // Chase what we will output, either {CODE} or {CODE-1}.
      var chase_length = 0;
      var chase = chase_code;
      while (chase > clear_code) {
        chase = code_table[chase] >> 8;
        ++chase_length;
      }
  
      var k = chase;
  
      var op_end = op + chase_length + (chase_code !== code ? 1 : 0);
      if (op_end > output_length) {
        console.log("Warning, gif stream longer than expected.");
        return;
      }
  
      // Already have the first byte from the chase, might as well write it fast.
      output[op++] = k;
  
      op += chase_length;
      var b = op;  // Track pointer, writing backwards.
  
      if (chase_code !== code)  // The case of emitting {CODE-1} + k.
        output[op++] = k;
  
      chase = chase_code;
      while (chase_length--) {
        chase = code_table[chase];
        output[--b] = chase & 0xff;  // Write backwards.
        chase >>= 8;  // Pull down to the prefix code.
      }
  
      if (prev_code !== null && next_code < 4096) {
        code_table[next_code++] = prev_code << 8 | k;
        // TODO(deanm): Figure out this clearing vs code growth logic better.  I
        // have an feeling that it should just happen somewhere else, for now it
        // is awkward between when we grow past the max and then hit a clear code.
        // For now just check if we hit the max 12-bits (then a clear code should
        // follow, also of course encoded in 12-bits).
        if (next_code >= code_mask+1 && cur_code_size < 12) {
          ++cur_code_size;
          code_mask = code_mask << 1 | 1;
        }
      }
  
      prev_code = code;
    }
  
    if (op !== output_length) {
      console.log("Warning, gif stream shorter than expected.");
    }
  
    return output;
  }


class GIF{
  constructor(esource, resources, overlying){
    console.log(esource, resources)
      var _ts = this;
      _ts.esource = esource;
      _ts.resources = resources;
      _ts.init(Boolean(overlying));
  }
  init(overlying){
      var _ts = this,
          esource = _ts.esource,
          resources = _ts.resources;

      _ts.temp = {                                        // 临时数据
          //loop:0,                                       // 保存当前需要播放的次数
          //tickerIsAdd:undefined                         // 保存轮循执行器是否添加
          events:{}                                       // 用于存放事件
      };

      // 属性
      _ts.__attr = {
        overlying: overlying,   // 后一张图是前一张图的叠加,用来解决部分情况下怪异的闪动问题
        autoPlay: true,     // 默认自动播放
        loop:0             // 默认无限次播放
      };

      // 方法
      _ts.__method = {
          play:_ts.play       // 播放方法
      };

      // 状态
      _ts.__status = {
          status:'init',      // 状态，默认初始化（init、playing、played、pause、stop）
          frame:0,            // 当前帧数
          loops:0,            // 连续循环播放次数，停止播放会清0
          time:0
      };
      
      // 循环执行器
      _ts.ticker = new PIXI.ticker.Ticker();
      _ts.ticker.stop();

      // 精灵
      _ts.sprite = this.createSprite(esource,resources);
  }

  // 播放
  play(loop, callback) {
    // 没有纹理材质时抛出错误
    if(!this.textures.length) throw new Error('没有可用的textures')
    // 纹理材质只有一帧时不往下执行
    if(this.textures.length === 1) return
    
    
    var status = this.__status,
        attr = this.__attr,
        time = 0;

    // 当状态是停止的时候，将播放次数清0
    if(status.status === 'stop') {
      status.loops = 0
    }

    // 设置循环参数
    loop = typeof loop === 'number' ? loop : attr.loop;
    this.temp.loop = loop;
    attr.loop = loop;

    // 修改状态为执行中
    this.__status = 'playing'
    // 为轮循执行器添加一个操作
    if(!this.temp.tickerIsAdd) {
      this.ticker.add(deltaTime => {
        var elapsed = PIXI.ticker.shared.elapsedMS
        time += elapsed
        // 当帧停留时间已达到间隔帧率时播放下一帧
        if(time > this.framesDelay[status.frame]) {
          status.frame++
          // 当一次播放完成，将播放帧归0，并记录播放次数
          if(status.frame > this.textures.length - 1){
            status.frame = 0;
            status.loops++;
            
            // 当指定了有效的播放次数并且当前播放次数达到指定次数时，执行回调则停止播放
            if(this.temp.loop > 0 && status.loops >= this.temp.loop) {
              console.log('播放完毕')
              if(typeof callback === 'function'){
                callback(status)
              }
              // 修改状态为执行完成并停止
              status.status = 'played';
              this.runEvent('played',status);
              this.stop();
            }
          }
          // console.log(status.frame, this.textures[status.frame])
          // 修改精灵纹理材质与当前的帧率相匹配
          this.sprite.texture = this.textures[status.frame]
          time = 0
        }
      })
      this.temp.tickerIsAdd = true
    }
    // 让轮循执行器开始执行
    this.ticker.start()
  }

  // 暂停
  pause(){
      var _ts = this,
          status = _ts.__status;
      _ts.ticker.stop();
      status.status = 'pause';
      _ts.runEvent('pause',status);
  }

  // 停止播放并跳至第一帧
  stop(){
      var _ts = this,
          status = _ts.__status;
      _ts.ticker.stop();
      status.status = 'stop'; 
      _ts.runEvent('stop',status);
  }

  // 事件
  on(type,fun){
    switch (type) {
      case 'played':
      case 'pause':
      case 'stop':
      this.temp.events[type] = fun;
      break;
      default:
        throw new Error('无效的事件');
      break;
    }
  }

  runEvent(type,status){
    var temp = this.temp;
    if(typeof temp.events[type] === 'function'){
      temp.events[type](status)
    }
  }

  getExeName(filePath) {
    var aList = filePath.split('.');
    return aList[aList.length - 1];
  }

  /**
   * 创建精灵
   * @param  {array:string}} imgSrc 图片资源路径
   * @param  {object} resources 已经加载的缓存资源
   * @return {object} 返回精灵
   */
  createSprite(esource,resources){
      var _ts = this;

      var Sprite = PIXI.Sprite,
          
          imgSrc = esource,
          exeName = this.getExeName(imgSrc.toLocaleLowerCase());
      
      // 文件扩展名为gif或png则返回对应的名称，其它反返回other
      exeName = exeName === 'gif' ? exeName : 'other';

      var funs = {
        'gif':()=>{
          var gifDecodeData = _ts.gifResourceToTextures(resources[imgSrc]);
          _ts.textures = gifDecodeData.textures;
          _ts.framesDelay = gifDecodeData.delayTimes;
          // _ts.play();
          // 返回精灵并将纹理材质设置为第一帧图像
          return new Sprite(_ts.textures[0]);
        },
        'other':()=>{
            _ts.textures = [resources[imgSrc].texture];
            return new Sprite(resources[imgSrc].texture);
        }
      };
      return funs[exeName]();
  }

  /**
   * 将apng缓存资源转换为纹理材质
   * @param  {object} resource    缓存资源
   * @return {object} 返回一个对象，包括apng的每帧时长及解码出来材质
   */
  apngResourceToTextures(resource){
      var _ts = this;
      var obj = {
              delayTimes:[],
              textures:[]
          },
          buf = new Uint8Array(resource.data),
          upng = $upngjs.decode(buf),
          rgba = $upngjs.toRGBA8(upng),
          pngWidth = upng.width,
          pngHeight = upng.height,
          pngFramesLen = upng.frames.length,
          
          spriteSheet,
          canvas,
          ctx,
          imageData;

      
      
      // 记录下每帧的时间
      upng.frames.forEach((item,index)=>{
          obj.delayTimes.push(item.delay);
      });

      for(var i=0,len=rgba.length; i<len; i++){
          var item = rgba[i],
              data = new Uint8ClampedArray(item);
          
          canvas = document.createElement('canvas');
          canvas.width = pngWidth;
          canvas.height = pngHeight;
          ctx = canvas.getContext('2d');
          spriteSheet = new PIXI.BaseTexture.fromCanvas(canvas);
          
          imageData = ctx.createImageData(pngWidth,pngHeight);
          imageData.data.set(data);
          ctx.putImageData(imageData,0,0);

          obj.textures.push(new PIXI.Texture(spriteSheet,new PIXI.Rectangle(0, 0, pngWidth, pngHeight)));
      };

      // document.body.appendChild(canvas);
      return obj;
  }

  /**
   * 将gif缓存资源转换为纹理材质
   * @param  {object} resource    缓存资源
   * @return {object} 返回一个对象，包括apng的每帧时长及解码出来材质
   */
  gifResourceToTextures(resource){
    console.time('testForEach')
    var _ts = this;
    var obj = {
      delayTimes:[],
      textures:[]
    },
    buf = new Uint8Array(resource.data),
    gif = new GifReader(buf),
    gifWidth = gif.width,
    gifHeight = gif.height,
    gifFramesLen = gif.numFrames(),
    gifFrameInfo,
    
    spriteSheet,
    canvas,
    ctx,
    imageData;
  
    
    var last = null
    for(var i = 0; i < gifFramesLen; i++) {
      //得到每帧的信息并将帧延迟信息保存起来
      gifFrameInfo = gif.frameInfo(i);
      obj.delayTimes.push(gifFrameInfo.delay * 10);

      canvas = document.createElement('canvas');
      canvas.width = gifWidth;
      canvas.height = gifHeight;
      ctx = canvas.getContext('2d');
      
      //创建一块空白的ImageData对象
      if (!this.__attr.overlying) {
        imageData = ctx.createImageData(gifWidth, gifHeight)
        // 将第一帧转换为RGBA值，将赋予到图像区
        gif.decodeAndBlitFrameRGBA(i, imageData.data)
      } else {
        if (last == null) last = ctx.createImageData(gifWidth, gifHeight)
        imageData = last
        // 将第一帧转换为RGBA值，将赋予到图像区
        gif.decodeAndBlitFrameRGBA(i, imageData.data)
        last = imageData
      }
      
      
      // 将上面创建的图像数据放回到画面上
      ctx.putImageData(imageData, 0, 0)
      
      spriteSheet = new PIXI.BaseTexture.fromCanvas(canvas)
      // console.log(imageData.data)
      obj.textures.push(new PIXI.Texture(spriteSheet,new PIXI.Rectangle(0, 0, gifWidth, gifHeight)))
      
    };
    console.timeEnd('testForEach')
    // document.body.appendChild(canvas);
    return obj
  }

}