Mục tiêu của khối này là biến lore từ trạng thái “định nghĩa bằng văn bản” thành **database có cấu trúc, truy vấn được, kiểm được canon, nuôi được narrative, nuôi được generation**.

Nó không phải wiki thường.  
 Nó là **canonical memory infrastructure** của toàn bộ Mikage engine.

---

## **1\. SYSTEM PURPOSE**

World Bible Database phải làm được 6 việc:

**1\. lưu sự thật chuẩn của universe**  
 mọi character, faction, era, location, technology, event đều có canonical record

**2\. lưu quan hệ giữa các thực thể**  
 ai thuộc phe nào, công nghệ nào được dùng ở era nào, event nào gây ra injury nào, location nào do faction nào kiểm soát

**3\. lưu timeline có thứ tự nhân quả**  
 không chỉ “có sự kiện”, mà phải biết trước-sau, nguyên nhân-hệ quả, điều kiện phát sinh

**4\. cấp dữ liệu cho narrative engine**  
 plot architect, scene sequencer, continuity editor phải query được universe state

**5\. cấp dữ liệu cho generation engine**  
 prompt compiler phải biết visual rules, era rules, tech rules, forbidden combinations

**6\. làm nguồn sự thật duy nhất**  
 mọi hệ khác không được tự bịa lore trái database

---

## **2\. CORE DESIGN LAW**

World Bible của Mikage phải tuân 8 luật:

**Law 1 — source of truth duy nhất**  
 Nếu lore trong prompt khác lore trong world bible, world bible thắng.

**Law 2 — event-based reality**  
 Không lưu world như tập mô tả tĩnh.  
 Phải lưu theo state \+ event \+ consequence.

**Law 3 — canon before aesthetics**  
 Một visual đẹp nhưng sai era / sai tech / sai relation thì bị reject.

**Law 4 — no floating facts**  
 Không có fact nào tồn tại một mình.  
 Mỗi fact phải có ít nhất 1 trong 4 thứ:

* source

* relation

* timeline anchor

* validation tag

**Law 5 — timeline is causal**  
 Event phải có:

* trigger

* participants

* impact

* persistence

**Law 6 — controlled ambiguity**  
 Universe có thể có mystery, nhưng mystery phải được đánh dấu rõ:

* public\_unknown

* classified\_unknown

* unresolved

* contradictory\_report

**Law 7 — every entity has operational value**  
 Nếu 1 entity không phục vụ narrative / world logic / generation / canon enforcement thì không nên tồn tại.

**Law 8 — versioned canon**  
 Mọi thay đổi canonical phải có revision log, không overwrite thô.

---

## **3\. DATABASE ARCHITECTURE**

Dùng mô hình **hybrid**:

**A. relational layer**  
 cho schema chặt, validation, query logic ổn định

**B. graph layer**  
 cho relation traversal và lineage reasoning

**C. document layer**  
 cho rich notes, lore excerpts, commentary, internal design memos

### **Kiến trúc khuyến nghị**

* **Postgres**: canonical tables \+ constraints

* **Neo4j / graph store**: entity relations

* **Object storage / JSON docs**: extended lore docs, scene packs, archive

* **Vector index**: semantic retrieval cho narrative và prompt assist, nhưng không được dùng làm source of truth

---

## **4\. ENTITY MODEL — CANONICAL TABLE SET**

Đây là bộ bảng lõi. Không nên thiếu.

## **4.1 `characters`**

Lưu nhân vật canonical.

Trường bắt buộc:

* `character_id`

* `canonical_name`

* `aliases`

* `status`

* `origin_era_id`

* `faction_affiliation_current`

* `biological_type`

* `synthetic_degree`

* `identity_core`

* `psychological_profile`

* `visual_dna_profile_id`

* `canon_tier`

* `public_visibility`

* `created_at`

* `updated_at`

Ý nghĩa:

* `identity_core`: bản chất bất biến

* `psychological_profile`: baseline, không phải state tạm thời

* `visual_dna_profile_id`: khóa identity hình ảnh

---

## **4.2 `factions`**

Lưu tổ chức, phe, nhà nước, cult, công nghiệp cluster.

Trường:

* `faction_id`

* `name`

* `type`

* `ideology`

* `governance_model`

* `resource_base`

* `military_capacity`

* `technology_bias`

* `territorial_scope`

* `enemy_factions`

* `allied_factions`

* `status`

* `symbolics`

* `canon_notes`

---

## **4.3 `locations`**

Lưu không gian vật lý.

Trường:

* `location_id`

* `name`

* `location_type`

* `parent_location_id`

* `era_relevance`

* `climate_profile`

* `infrastructure_profile`

* `strategic_value`

* `visual_identity`

* `controlling_faction_id`

* `access_rules`

* `known_hazards`

* `canon_status`

Quan trọng:

* location phải hỗ trợ hierarchy  
   ví dụ: megacity \> district \> rooftop \> maintenance platform

---

## **4.4 `eras`**

Lưu thời đại.

Trường:

* `era_id`

* `name`

* `sequence_order`

* `start_anchor`

* `end_anchor`

* `civilization_state`

* `energy_regime`

* `military_doctrine`

* `dominant_aesthetic`

* `forbidden_elements`

* `technology_ceiling`

* `social_conditions`

* `canon_summary`

Era là thứ khóa prompt, narrative, tech plausibility.

---

## **4.5 `technology_systems`**

Lưu công nghệ.

Trường:

* `tech_id`

* `name`

* `category`

* `energy_source`

* `operational_principle`

* `thermodynamic_cost`

* `failure_modes`

* `visible_signatures`

* `era_availability`

* `faction_access`

* `weaponization_potential`

* `forbidden_misreadings`

* `canon_status`

Ví dụ:  
 crimson leakage không phải magic  
 → phải map về tech system cụ thể \+ failure signature cụ thể

---

## **4.6 `weapon_systems`**

Lưu vũ khí, platform, delivery mechanism.

Trường:

* `weapon_id`

* `name`

* `class`

* `energy_requirements`

* `platform_type`

* `effective_range`

* `operational_constraints`

* `signature_effects`

* `failure_risks`

* `authorized_factions`

* `era_validity`

* `canon_notes`

---

## **4.7 `events`**

Đây là trái tim của world bible.

Trường:

* `event_id`

* `name`

* `event_type`

* `era_id`

* `start_time`

* `end_time`

* `location_id`

* `summary`

* `trigger`

* `participants`

* `causal_parents`

* `immediate_consequences`

* `persistent_consequences`

* `public_knowledge_level`

* `canon_confidence`

* `revision_status`

Không có event table mạnh thì timeline sẽ chết.

---

## **4.8 `relationships`**

Lưu quan hệ giữa entity với entity.

Trường:

* `relationship_id`

* `source_entity_type`

* `source_entity_id`

* `target_entity_type`

* `target_entity_id`

* `relationship_type`

* `start_event_id`

* `end_event_id`

* `confidence`

* `visibility`

* `notes`

Ví dụ:

* character belongs\_to faction

* faction controls location

* character participated\_in event

* tech restricted\_to faction

* event damaged location

---

## **4.9 `timeline_anchors`**

Neo cột mốc thời gian.

Trường:

* `anchor_id`

* `label`

* `absolute_order`

* `era_id`

* `description`

* `related_event_ids`

Dùng để giữ continuity khi chưa có calendar tuyệt đối.

---

## **4.10 `visual_dna_profiles`**

Khóa identity hình ảnh.

Trường:

* `visual_dna_profile_id`

* `entity_type`

* `entity_id`

* `palette_rules`

* `material_rules`

* `silhouette_rules`

* `camera_rules`

* `forbidden_visual_traits`

* `damage_language`

* `lighting_constraints`

* `generation_priority`

Bảng này cực quan trọng cho Mikage.

---

## **4.11 `canon_rules`**

Link sang rule system nhưng có snapshot tham chiếu.

Trường:

* `rule_id`

* `rule_group`

* `rule_text`

* `severity`

* `scope`

* `examples_valid`

* `examples_invalid`

* `validator_binding`

---

## **4.12 `canon_revisions`**

Lưu lịch sử thay đổi canon.

Trường:

* `revision_id`

* `entity_type`

* `entity_id`

* `changed_fields`

* `change_reason`

* `author_role`

* `approved_by`

* `timestamp`

* `impact_scope`

* `backward_compatibility`

---

## **5\. GRAPH RELATION MODEL**

Quan hệ graph tối thiểu phải có:

* `CHARACTER` — `MEMBER_OF` → `FACTION`

* `CHARACTER` — `PARTICIPATED_IN` → `EVENT`

* `CHARACTER` — `INJURED_IN` → `EVENT`

* `CHARACTER` — `LOCATED_AT` → `LOCATION`

* `CHARACTER` — `USES` → `TECHNOLOGY`

* `FACTION` — `CONTROLS` → `LOCATION`

* `FACTION` — `DEVELOPS` → `TECHNOLOGY`

* `EVENT` — `OCCURS_IN` → `LOCATION`

* `EVENT` — `BELONGS_TO` → `ERA`

* `EVENT` — `CAUSES` → `EVENT`

* `EVENT` — `CHANGES_STATE_OF` → `CHARACTER`

* `TECHNOLOGY` — `AVAILABLE_IN` → `ERA`

* `WEAPON_SYSTEM` — `BASED_ON` → `TECHNOLOGY`

* `LOCATION` — `PART_OF` → `LOCATION`

* `VISUAL_DNA_PROFILE` — `GOVERNS` → `CHARACTER`

Graph dùng cho:

* continuity reasoning

* conflict detection

* causal tracing

* narrative recall

* prompt guardrails

---

## **6\. DATA CLASSES — FACT CONFIDENCE MODEL**

Không phải fact nào cũng cùng cấp.

Mỗi record phải có `canon_confidence_class`:

* `absolute_canon`  
   sự thật khóa cứng

* `high_canon`  
   rất ổn định nhưng có thể mở rộng chi tiết

* `soft_canon`  
   được chấp nhận tạm thời

* `reported`  
   thông tin trong universe nhưng có thể sai lệch

* `unknown`

* `contested`

Điều này cho phép universe có độ sâu mà không phá logic.

---

## **7\. VALIDATION LAYER FOR WORLD BIBLE**

World Bible phải có validator riêng, khác với prompt validator.

## **7.1 entity validation**

kiểm:

* id uniqueness

* required fields

* enum validity

* relation type validity

## **7.2 canon validation**

kiểm:

* có vi phạm ontology không

* có vi phạm invariants không

* có drift fantasy không

* có tech vượt era ceiling không

## **7.3 continuity validation**

kiểm:

* event order

* relation overlap

* character xuất hiện khi chưa tồn tại

* faction kiểm soát location sai thời gian

## **7.4 semantic validation**

kiểm:

* mô tả có dùng từ dẫn fantasy không

* tech explanation có giả-khoa-học yếu không

* visual notes có drift neon/anime không

## **7.5 revision validation**

kiểm:

* sửa record này có phá 12 record khác không

* có cần cascade update không

* có cần manual review không

---

## **8\. MINIMUM JSON SCHEMA PACK**

Ngay bây giờ, để triển khai nhanh, nên có 10 schema file đầu tiên:

* `character.schema.json`

* `faction.schema.json`

* `location.schema.json`

* `era.schema.json`

* `technology.schema.json`

* `weapon_system.schema.json`

* `event.schema.json`

* `relationship.schema.json`

* `visual_dna.schema.json`

* `canon_revision.schema.json`

---

## **9\. WORLD BIBLE FILE STRUCTURE**

Cấu trúc thư mục chuẩn studio:

/world\_bible  
 /schemas  
   character.schema.json  
   faction.schema.json  
   location.schema.json  
   era.schema.json  
   technology.schema.json  
   weapon\_system.schema.json  
   event.schema.json  
   relationship.schema.json  
   visual\_dna.schema.json  
   canon\_revision.schema.json

 /seed  
   characters.seed.json  
   factions.seed.json  
   locations.seed.json  
   eras.seed.json  
   technologies.seed.json  
   weapon\_systems.seed.json  
   events.seed.json  
   relationships.seed.json  
   visual\_dna.seed.json

 /registry  
   entity\_registry.json  
   enum\_registry.json  
   relation\_registry.json  
   timeline\_registry.json

 /validator  
   world\_bible.rulepack.json  
   continuity.rulepack.json  
   ontology.rulepack.json  
   revision.rulepack.json

 /revisions  
   0001\_initial\_foundation.json  
   0002\_faction\_alignment\_patch.json  
   0003\_mikage\_visual\_lock\_patch.json

 /exports  
   world\_bible.snapshot.json  
   timeline.snapshot.json  
   prompt\_context.snapshot.json  
   narrative\_context.snapshot.json  
---

## **10\. CANONICAL QUERY MODES**

World Bible phải support 5 loại query.

### **10.1 lookup query**

Ví dụ:

* Mikage thuộc faction nào?

* location này ở era nào?

### **10.2 continuity query**

* tại event X Mikage đang bị thương chưa?

* faction Y còn kiểm soát district Z không?

### **10.3 generation query**

* scene ở late entropy industrial age có được dùng weapon class này không?

* visual prompt cho Mikage tại mốc này là gì?

### **10.4 narrative query**

* trước event này đã có những xung đột nào?

* ai biết bí mật công nghệ này?

### **10.5 contradiction query**

* prompt này có dùng tech chưa tồn tại không?

* character state trong scene có lệch world state không?

---

## **11\. OUTPUT CONTRACT CHO CÁC HỆ KHÁC**

World Bible không được trả dữ liệu tùy hứng.  
 Nó phải trả theo contract.

## **11.1 cho prompt compiler**

trả:

* era rules

* faction rules

* location visual grammar

* character visual dna

* forbidden pairings

## **11.2 cho narrative engine**

trả:

* timeline state

* valid participants

* known conflicts

* emotional baggage history

* unresolved threads

## **11.3 cho validator**

trả:

* canon facts

* rule scope

* contradiction checks

* event causality chain

## **11.4 cho studio UI**

trả:

* entity cards

* relation graph

* timeline visualization

* revision history

* approval status

---

## **12\. DATA ENTRY POLICY**

Không phải lore nào cũng được nhập vào.

Một record chỉ được vào World Bible khi đạt 1 trong 3 điều kiện:

**A. approved canon**  
 đã qua review

**B. system-required foundational data**  
 cần cho pipeline chạy

**C. provisional narrative data**  
 được gắn nhãn soft/provisional rõ ràng

Không được nhét:

* mô tả cảm hứng mơ hồ

* note sáng tác chưa kiểm

* visual prose không có operational meaning

---

## **13\. WORLD BIBLE REVIEW WORKFLOW**

Pipeline chuẩn:

**proposal**  
 → entity draft được tạo

**schema validation**  
 → check field, type, enum

**canon validation**  
 → check ontology, invariants, era fit

**relation linking**  
 → map quan hệ với entity khác

**continuity simulation**  
 → thử impact lên timeline

**approval review**  
 → human/studio decision

**publish to canonical store**  
 → record thành source of truth

**snapshot export**  
 → cập nhật cho narrative/prompt systems

---

## **14\. MIKAGE-SPECIFIC PRIORITY BUILD ORDER**

Không cần build full universe một phát.  
 Build theo giá trị vận hành.

## **Phase 1 — foundation**

* eras

* factions

* locations

* characters

* visual\_dna\_profiles

* canon\_rules

## **Phase 2 — runtime support**

* technology\_systems

* weapon\_systems

* relationships

* timeline\_anchors

## **Phase 3 — narrative continuity**

* events

* causal chains

* revision tracking

* public knowledge layers

## **Phase 4 — scale**

* mystery handling

* regional sub-databases

* doctrine packs

* conflict maps

* cultural memory archives

---

## **15\. FIRST CANONICAL RECORDS PHẢI CÓ**

Để hệ chạy được, World Bible phải có ngay các record tối thiểu sau:

### **Era**

* pre-collapse industrial memory

* late entropy industrial age

### **Character**

* Mikage

### **Faction**

* faction hiện tại của Mikage

* ít nhất 1 phe đối trọng

* ít nhất 1 hệ quyền lực công nghiệp

### **Location**

* megacity

* rooftop maintenance platform

* industrial district

* undercity zone

### **Tech**

* porcelain armor composite system

* carbon fiber reinforcement class

* reactor conduit leakage model

* mask material spec

* surveillance / drone infrastructure

### **Event**

* ít nhất 1 foundational trauma event

* ít nhất 1 faction conflict event

* ít nhất 1 body-damage event

* ít nhất 1 loyalty fracture event

---

## **16\. WORLD BIBLE SCORECARD**

Muốn biết khối này đã đạt chưa, đo bằng 8 tiêu chí:

* có query được source of truth không

* có phát hiện contradiction không

* có khóa được era plausibility không

* có nuôi narrative continuity không

* có nuôi visual generation không

* có revision history chuẩn không

* có graph traversal usable không

* có giảm drift rõ rệt không

Nếu chưa đạt 8 cái này thì chưa phải studio-grade.

---

## **17\. BẢN CHỐT TRIỂN KHAI**

**World Bible System của Mikage phải được dựng như một canonical lore database đa tầng, gồm relational schema \+ graph relations \+ revision log \+ validator riêng, làm nguồn sự thật duy nhất cho narrative engine, prompt compiler, generation runtime và studio control interface.**

Đây không phải thư viện lore.  
 Đây là **memory core của IP Operating System**.

