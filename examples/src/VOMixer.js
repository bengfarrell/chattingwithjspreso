/**
 * Copied from Node-Google-Text-To-Speech module
 * https://github.com/ashafir20/node-google-text-to-speech
 *
 * Altered to not change output to Base64 String, and since I'm
 * modifying it for my own purposes, I'll make it more directly tied in
 * as a VO creation script (mix with bed if I can)
 */
var ffmpeg = require('./ffmpeg-node');

/**
 * Mix a spoken VO with a music bed
 */
var VOMixer = function() {
    var self = this;

    /**
     * c-tor
     */
    this.init = function() {};

    /**
     * mix VO with music bed
     * @param options
     * @param callback
     */
    this.mix = function(opts, callback) {
        console.log('VOMixer', 'Mixing: ' + opts.vo + ' and  ' + opts.bed + ' to ' + opts.outfile);

            /**
             * Example FFMPEG call
             ffmpeg -i vo-block-1.mp3 -i VO_musicbed.mp3 -filter_complex "[1:0]afade=t=in:d=5,afade=t=out:st=30:d=5[BED];[0:0]adelay=7000,a
             pad=pad_len=40000[VO];[VO][BED]amix=inputs=2:duration=shortest" -ar 44100 out.mp3
             */
            // please note that VO end padding is not in seconds but number of samples
            var endPaddingSamples = opts.voEndPadding * opts.voSamplingRate;

            ffmpeg.exec(['-i', opts.vo, '-i', opts.bed, "-filter_complex",
                    '[1:0]afade=t=in:d=' + opts.fadeInDuration +
                    ',afade=t=out:st=' + (opts.voLength + opts.voDelay + opts.voEndPadding - opts.fadeOutDuration) + ':d=' + opts.fadeOutDuration +
                    '[BED];[0:0]adelay=' + opts.voDelay * 1000 + ',apad=pad_len=' +
                    endPaddingSamples + '[VO];[VO][BED]amix=inputs=2:duration=shortest',
                    '-ar', opts.outFileSampleRate, opts.outfile],
                function() {
                    // update with new duration
                    console.log('done mix');
                    self.onMixComplete(callback);
                });
    };

    /**
     * on mix complete
     */
    this.onMixComplete = function(callback) {
        callback.apply(self);
    };

    this.init();
};

exports = module.exports = VOMixer;