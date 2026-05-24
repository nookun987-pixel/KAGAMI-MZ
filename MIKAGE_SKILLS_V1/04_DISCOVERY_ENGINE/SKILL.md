---
name: mikage-discovery-engine
description: Mikage discovery and promotion readiness rules. Use when choosing tracks for campaigns, planning promotion, writing discovery tasks, or preparing platform-specific short-video pushes.
---

# Discovery Engine

## Purpose

Promote only tracks that are ready and avoid presenting unreleased or uncertain catalog items as live.

## Release Status Rules

- Only live-confirmed tracks can use `Listen now:`.
- Future releases use `Pre-save:`.
- Uncertain status uses `Link:`.
- Do not push unreleased catalog as live.
- Do not treat TooLost delivery as public/listenable confirmation.

## Campaign Start Rule

Start discovery campaigns with current live-confirmed tracks only.

If a track's live status is missing, mark `CHUA_XAC_NHAN` and exclude it from live-now campaign language.

## Required Promotion Inputs

Each promoted track needs:

- hook short
- caption
- audience angle
- platform
- result tracking plan

## Verification

Before launch or task handoff, check each promoted track against memory/catalog/handoff status and confirm wording matches status.
