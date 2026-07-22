# Security Specification - website-sorside Admin

This document specifies the security invariants and testing scenarios for the sorside website configuration database.

## Data Invariants

1. **siteConfig** collection contains the general home page configuration document (specifically with ID `home`).
   - Anyone can read the configuration to render the website correctly.
   - Only verified admin (`taufikur.rn11@gmail.com`) can write to `siteConfig`.
   - String fields must respect size constraints (e.g. descriptionQuote <= 500, descriptionDetail <= 2000, posterImageUrl <= 1000).

2. **journeyPoints** collection contains individual milestones on the timeline.
   - Anyone can read/list milestones.
   - Only verified admin (`taufikur.rn11@gmail.com`) can write/modify milestones.
   - All journey points must have unique ID string and appropriate maximum sizes.

## The "Dirty Dozen" Malicious Payloads to Block

1. **Spoofed Admin Write**: User tries to write to `siteConfig/home` with email unverified or with a different email.
2. **Ghost Field Injection**: User tries to inject a hidden field (e.g., `maliciousToken`) into the home configuration.
3. **Payload Value Poisoning (Size Exceeded)**: User tries to set `descriptionQuote` with a 1MB string to run up storage costs.
4. **Invalid Image URL Type**: User tries to set `posterImageUrl` to a boolean instead of a string.
5. **Path ID Poisoning**: User tries to create a journeyPoint with an ID containing special characters like `../` or exceeding 128 characters.
6. **No-Auth Modification**: An unauthenticated client tries to delete a journey point.
7. **Modifying Immortal Fields**: A user trying to bypass the email verification check.
8. **Setting invalid data types**: Trying to set `order` of `journeyPoints` to a string instead of a number.
9. **Spamming the Timeline**: Creating journey points with a negative order or missing mandatory fields.
10. **Admin Claim Spoofing**: Trying to use client custom claims to bypass rules.
11. **Overwriting System Metadata**: Trying to manipulate `updatedAt` with client-controlled future/past timestamps instead of `request.time`.
12. **Malicious list scraping**: Trying to read non-existent collections.
