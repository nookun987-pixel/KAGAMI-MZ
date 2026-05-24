---
name: mikage-audio-export-standard
description: Mikage final MP4 audio quality standard. Use when repairing, exporting, remuxing, reviewing, or verifying final video files with audio.
---

# Audio Export Standard

## Purpose

Prevent audio quality loss in final MP4 outputs.

## Source Rule

Always use the original WAV/master audio when repairing or exporting final MP4 files.

Never reuse compressed MP4 audio as the final audio source.

If the original WAV/master is missing, stop and report the missing source. Do not substitute MP3, AAC, or MP4 audio.

## Final MP4 Standard

- Video codec: H.264.
- Resolution for shorts: 1080x1920.
- Frame rate: 30fps.
- Audio codec: AAC.
- Audio bitrate target: 320k.
- Audio sample rate: 48kHz.
- Audio channels: stereo.

## Verification

Verify final files with ffprobe or equivalent.

The final audio bitrate should be around 317000-320000+ bps.

If the final audio bitrate is around 192000 bps, mark `FAIL_AUDIO_BITRATE_LOW`.

Do not claim pass until codec, bitrate, sample rate, channel count, and source audio identity are confirmed.
