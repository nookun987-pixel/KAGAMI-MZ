# RENDER_PACKAGE_MANIFEST

PACKAGE_STANDARD: MIKAGE_PUBLIC_ENGINE_OPERATING_STANDARD_V1
TRACK_ID: T02
TRACK_TITLE: DIGITAL ASH
SPEC_FILE: spec/RELEASE_SIGNAL_SPEC.md
AUDIO_FILE: CHUA_XAC_NHAN
AUDIO_WINDOW: 0:48 -> 1:20
TARGET_OUTPUT: MIKAGE_T02_RELEASE_SIGNAL_SHORT_V2
VIDEO_FORMAT: 1080x1920 vertical short
VISUAL_RULE: Text-only unless package explicitly approves assets.
SCREEN_RULE: 5-sub means sequential timed text blocks or production manifest, not five static lines on screen.
BANNED: MP4 render; video output; hook timeline change; creative rewrite; invented live status; invented proof status; invented website status; unapproved lyrics; unapproved cover; unapproved character art; Listen now CTA without confirmed live status.
CTA_ON_SCREEN: Pre-save:
CTA_CAPTION: Pre-save:
MISSING_ITEMS: AUDIO_FILE; CAPTION_SOURCE_STATUS; TIMED_TEXT_STATUS; PRE_SAVE_LINK; LIVE_LINK; RELEASE_DATE; TOOLOST_STATUS; LINK_STATUS; LANGUAGE; EXPLICIT_STATUS; PROOF_PACK_STATUS; WEBSITE_STATUS
READY_FOR_GPT_RENDER: NO_AUDIO_SOURCE_CHUA_XAC_NHAN
