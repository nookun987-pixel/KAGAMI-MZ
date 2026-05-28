# Đây là khối khóa continuity cho nhân vật.  Nếu World Bible là **memory core của universe**, thì Character State Tracker là **runtime truth của con người bên trong universe**.

# Nó giải quyết đúng vấn đề lớn nhất của narrative scale:

* # nhân vật bị viết lệch theo scene 

* # chấn thương không để lại hậu quả 

* # loyalty thay đổi vô cớ 

* # knowledge bị teleport 

* # trạng thái tâm lý bị reset sai 

* # scene đẹp nhưng sai continuity 

# ---

# **1\) SYSTEM PURPOSE**

# Character State Tracker phải làm được 7 việc:

# **1\. lưu state của nhân vật theo thời gian**  không chỉ character là ai, mà ở từng mốc họ đang ở trạng thái nào

# **2\. quản lý state transition có nhân quả**  mọi thay đổi phải đến từ event, decision, injury, stress, revelation, betrayal, recovery

# **3\. khóa narrative continuity**  scene sau phải kế thừa hậu quả của scene trước

# **4\. nuôi narrative engine**  plot architect, scene sequencer, prose writer phải lấy state thật đang active

# **5\. nuôi cinematic adaptation**  biết lúc nào Mikage bị thương, lệch loyalties, mất ổn định reactor, knowledge bị khóa

# **6\. tạo conflict đúng logic**  xung đột không còn là “viết cho hay”, mà xuất phát từ state collision

# **7\. chống character drift**  nhân vật có thể phát triển, nhưng không được tự nhiên biến thành người khác

# ---

# **2\) CORE DESIGN LAW**

# Character State Tracker phải tuân 10 luật.

## **Law 1 — character truth bất biến, state thì biến đổi**

* # `identity_core` là cố định từ World Bible 

* # `state` là runtime layer có thể thay đổi 

## **Law 2 — no state without trigger**

# Không có thay đổi nào tự xuất hiện.  Mọi state change phải có:

* # event trigger 

* # causal source 

* # confidence 

* # time anchor 

## **Law 3 — persistence matters**

# Một injury lớn, loyalty fracture, memory loss, trauma, knowledge gain phải tồn tại qua các scene sau, cho đến khi có transition hợp lệ.

## **Law 4 — state is multi-axis**

# Không được gộp “tâm trạng” thành một cục.  State phải chia thành nhiều trục riêng.

## **Law 5 — damage is stateful**

# Damage không chỉ là mô tả.  Nó phải ảnh hưởng đến:

* # capability 

* # endurance 

* # perception 

* # behavior 

* # appearance 

## **Law 6 — knowledge is not free**

# Character chỉ biết cái gì họ:

* # trải qua 

* # được kể 

* # giải mã 

* # suy ra hợp lý 

## **Law 7 — loyalty is conditional, not binary**

# Loyalty không phải true/false.  Nó là vector:

* # allegiance 

* # trust 

* # obedience 

* # emotional bond 

* # ideological alignment 

## **Law 8 — recovery requires mechanism**

# Không có heal/reset vô cớ.  Recovery cần:

* # time 

* # repair 

* # therapy 

* # system intervention 

* # adaptive hardening 

* # cost 

## **Law 9 — psychological states must affect action**

# Nếu nhân vật bị trauma/stress/disorientation thì narrative output phải bị chi phối.

## **Law 10 — timeline wins**

# Khi nhiều state mâu thuẫn, state gần nhất và được timeline-validated thắng.

# ---

# **3\) STATE ARCHITECTURE**

# Character State Tracker dùng mô hình **snapshot \+ transition log \+ derived active state**.

## **3.1 Ba lớp dữ liệu**

### **A. Baseline Character Truth**

# Lấy từ World Bible:

* # identity core 

* # baseline traits 

* # visual DNA 

* # canonical limitations 

* # faction alignment baseline 

### **B. State Snapshots**

# Ảnh chụp trạng thái ở từng mốc timeline:

* # injury level 

* # knowledge holdings 

* # trust state 

* # psychological strain 

* # body integrity 

* # faction stance 

* # active objectives 

### **C. Transition Log**

# Lưu nguyên nhân state đổi:

* # event 

* # cause 

* # old value 

* # new value 

* # confidence 

* # persistence window 

### **Runtime Rule**

# `active_state = latest_valid_snapshot + validated transitions up to anchor`

# ---

# **4\) STATE AXIS MODEL**

# Mỗi character phải được theo dõi ít nhất 9 trục.

## **4.1 Physical State**

* # body integrity 

* # mobility 

* # pain load 

* # fatigue 

* # repair status 

* # scar/fracture persistence 

## **4.2 Combat State**

* # precision 

* # endurance 

* # system stability 

* # reaction degradation 

* # weapon readiness 

## **4.3 Reactor / Systemic State**

# áp dụng cho nhân vật có hỗ trợ hệ thống như Mikage

* # conduit stability 

* # leakage visibility 

* # overload risk 

* # thermal stress 

* # operating threshold 

## **4.4 Psychological State**

* # emotional compression 

* # trauma activation 

* # dissociation risk 

* # rage containment 

* # fear load 

* # clarity 

* # selfhood cohesion 

## **4.5 Loyalty State**

* # faction allegiance 

* # trust by faction 

* # trust by individual 

* # obedience 

* # rebellion pressure 

* # ideological fit 

## **4.6 Knowledge State**

* # secrets known 

* # truths suspected 

* # false beliefs held 

* # classified access 

* # unresolved gaps 

## **4.7 Social / Relationship State**

* # bond strength 

* # debt 

* # hatred 

* # grief 

* # dependency 

* # betrayal residue 

## **4.8 Mission State**

* # current goal 

* # hidden agenda 

* # conflicting directive 

* # objective commitment 

* # abort threshold 

## **4.9 Visibility State**

* # public identity exposure 

* # faction traceability 

* # surveillance heat 

* # bounty / pursuit level 

# ---

# **5\) MASTER ENTITY SET**

# Character State Tracker cần các entity sau:

* # `CharacterStateSnapshot` 

* # `CharacterStateTransition` 

* # `InjuryRecord` 

* # `LoyaltyState` 

* # `KnowledgeState` 

* # `PsychologicalState` 

* # `SystemState` 

* # `MissionState` 

* # `RelationshipState` 

* # `StateValidatorReport` 

# ---

# **6\) MASTER ENUM REGISTRY**

# {

#  "state\_confidence": \[

#    "observed",

#    "inferred\_high",

#    "inferred\_medium",

#    "reported",

#    "uncertain"

#  \],

#  "state\_severity": \[

#    "none",

#    "low",

#    "moderate",

#    "high",

#    "critical",

#    "terminal"

#  \],

#  "injury\_types": \[

#    "blunt\_impact",

#    "laceration",

#    "fracture",

#    "burn",

#    "conduit\_damage",

#    "neural\_stress",

#    "organ\_damage",

#    "systemic\_overload",

#    "composite\_armor\_failure"

#  \],

#  "injury\_regions": \[

#    "head",

#    "face",

#    "torso",

#    "left\_arm",

#    "right\_arm",

#    "left\_leg",

#    "right\_leg",

#    "spinal\_axis",

#    "internal\_system",

#    "full\_body"

#  \],

#  "recovery\_states": \[

#    "untreated",

#    "stabilized",

#    "repairing",

#    "scarred",

#    "adapted",

#    "degraded",

#    "irreversible"

#  \],

#  "knowledge\_types": \[

#    "verified\_truth",

#    "suspected\_truth",

#    "false\_belief",

#    "classified\_fact",

#    "partial\_model",

#    "memory\_fragment"

#  \],

#  "knowledge\_access\_levels": \[

#    "public",

#    "restricted",

#    "classified",

#    "black"

#  \],

#  "loyalty\_stances": \[

#    "devoted",

#    "aligned",

#    "conditional",

#    "strained",

#    "fractured",

#    "hostile",

#    "unknown"

#  \],

#  "psychological\_flags": \[

#    "stable",

#    "compressed",

#    "hypervigilant",

#    "dissociative",

#    "grief\_locked",

#    "rage\_suppressed",

#    "identity\_fragmenting",

#    "self\_directed\_recovery"

#  \],

#  "mission\_status": \[

#    "inactive",

#    "assigned",

#    "active",

#    "compromised",

#    "aborted",

#    "completed",

#    "diverted"

#  \]

# }

# ---

# **7\) STATE SCHEMA PACK**

# ---

## **7.1 `CharacterStateSnapshot`**

# Đây là record trung tâm.

# {

#  "entity\_type": "CharacterStateSnapshot",

#  "required\_fields": \[

#    "id",

#    "character\_id",

#    "timeline\_anchor\_id",

#    "derived\_from\_event\_ids",

#    "physical\_state",

#    "combat\_state",

#    "system\_state",

#    "psychological\_state",

#    "loyalty\_state",

#    "knowledge\_state",

#    "mission\_state",

#    "visibility\_state",

#    "state\_confidence",

#    "created\_at"

#  \],

#  "fields": {

#    "id": "string",

#    "character\_id": "string",

#    "timeline\_anchor\_id": "string",

#    "derived\_from\_event\_ids": "string\[\]",

#    "previous\_snapshot\_id": "string|null",

#    "physical\_state": "object",

#    "combat\_state": "object",

#    "system\_state": "object",

#    "psychological\_state": "object",

#    "loyalty\_state": "object",

#    "knowledge\_state": "object",

#    "relationship\_state\_refs": "string\[\]",

#    "mission\_state": "object",

#    "visibility\_state": "object",

#    "active\_constraints": "string\[\]",

#    "state\_confidence": "enum:state\_confidence",

#    "notes": "string",

#    "created\_at": "string"

#  }

# }

# ---

## **7.2 `CharacterStateTransition`**

# {

#  "entity\_type": "CharacterStateTransition",

#  "required\_fields": \[

#    "id",

#    "character\_id",

#    "timeline\_anchor\_id",

#    "trigger\_event\_id",

#    "transition\_type",

#    "affected\_axes",

#    "old\_state\_ref",

#    "new\_state\_ref",

#    "causal\_basis",

#    "state\_confidence"

#  \],

#  "fields": {

#    "id": "string",

#    "character\_id": "string",

#    "timeline\_anchor\_id": "string",

#    "trigger\_event\_id": "string",

#    "transition\_type": "string",

#    "affected\_axes": "string\[\]",

#    "old\_state\_ref": "string|null",

#    "new\_state\_ref": "string",

#    "causal\_basis": "string",

#    "reversibility": "string",

#    "persistence\_class": "string",

#    "state\_confidence": "enum:state\_confidence",

#    "notes": "string"

#  }

# }

# ---

## **7.3 `InjuryRecord`**

# {

#  "entity\_type": "InjuryRecord",

#  "required\_fields": \[

#    "id",

#    "character\_id",

#    "event\_id",

#    "timeline\_anchor\_id",

#    "injury\_type",

#    "injury\_region",

#    "severity",

#    "functional\_effects",

#    "recovery\_state",

#    "persistence"

#  \],

#  "fields": {

#    "id": "string",

#    "character\_id": "string",

#    "event\_id": "string",

#    "timeline\_anchor\_id": "string",

#    "injury\_type": "enum:injury\_types",

#    "injury\_region": "enum:injury\_regions",

#    "severity": "enum:state\_severity",

#    "description": "string",

#    "functional\_effects": "string\[\]",

#    "visible\_signatures": "string\[\]",

#    "repair\_requirements": "string\[\]",

#    "recovery\_state": "enum:recovery\_states",

#    "persistence": "string",

#    "scar\_probability": "number",

#    "canon\_notes": "string"

#  }

# }

# ---

## **7.4 `LoyaltyState`**

# {

#  "entity\_type": "LoyaltyState",

#  "required\_fields": \[

#    "id",

#    "character\_id",

#    "timeline\_anchor\_id",

#    "primary\_target\_type",

#    "primary\_target\_id",

#    "allegiance\_score",

#    "trust\_score",

#    "obedience\_score",

#    "ideological\_alignment\_score",

#    "stance"

#  \],

#  "fields": {

#    "id": "string",

#    "character\_id": "string",

#    "timeline\_anchor\_id": "string",

#    "primary\_target\_type": "string",

#    "primary\_target\_id": "string",

#    "allegiance\_score": "number",

#    "trust\_score": "number",

#    "obedience\_score": "number",

#    "ideological\_alignment\_score": "number",

#    "emotional\_bond\_score": "number",

#    "betrayal\_residue\_score": "number",

#    "stance": "enum:loyalty\_stances",

#    "causal\_drivers": "string\[\]",

#    "notes": "string"

#  }

# }

# Điểm số chuẩn hóa từ `-1.0` đến `1.0`.

# ---

## **7.5 `KnowledgeState`**

# {

#  "entity\_type": "KnowledgeState",

#  "required\_fields": \[

#    "id",

#    "character\_id",

#    "timeline\_anchor\_id",

#    "knowledge\_items",

#    "uncertainty\_map"

#  \],

#  "fields": {

#    "id": "string",

#    "character\_id": "string",

#    "timeline\_anchor\_id": "string",

#    "knowledge\_items": "object\[\]",

#    "uncertainty\_map": "object\[\]",

#    "missing\_critical\_knowledge": "string\[\]",

#    "false\_belief\_load": "number",

#    "cognitive\_pressure": "number",

#    "notes": "string"

#  }

# }

### **Knowledge item structure**

# {

#  "knowledge\_id": "string",

#  "subject\_type": "string",

#  "subject\_id": "string",

#  "knowledge\_type": "enum:knowledge\_types",

#  "access\_level": "enum:knowledge\_access\_levels",

#  "source\_event\_id": "string|null",

#  "source\_character\_id": "string|null",

#  "confidence\_score": "number",

#  "summary": "string"

# }

# ---

## **7.6 `PsychologicalState`**

# {

#  "entity\_type": "PsychologicalState",

#  "required\_fields": \[

#    "id",

#    "character\_id",

#    "timeline\_anchor\_id",

#    "selfhood\_cohesion",

#    "stress\_load",

#    "trauma\_activation",

#    "decision\_clarity",

#    "active\_flags"

#  \],

#  "fields": {

#    "id": "string",

#    "character\_id": "string",

#    "timeline\_anchor\_id": "string",

#    "selfhood\_cohesion": "number",

#    "stress\_load": "number",

#    "trauma\_activation": "number",

#    "rage\_pressure": "number",

#    "fear\_load": "number",

#    "decision\_clarity": "number",

#    "emotional\_compression": "number",

#    "active\_flags": "enum:psychological\_flags\[\]",

#    "behavioral\_risks": "string\[\]",

#    "stabilizers": "string\[\]",

#    "notes": "string"

#  }

# }

# Điểm số chuẩn hóa từ `0.0` đến `1.0`.

# ---

## **7.7 `SystemState`**

# {

#  "entity\_type": "SystemState",

#  "required\_fields": \[

#    "id",

#    "character\_id",

#    "timeline\_anchor\_id",

#    "conduit\_stability",

#    "leakage\_visibility",

#    "overload\_risk",

#    "thermal\_stress",

#    "operational\_capacity"

#  \],

#  "fields": {

#    "id": "string",

#    "character\_id": "string",

#    "timeline\_anchor\_id": "string",

#    "conduit\_stability": "number",

#    "leakage\_visibility": "number",

#    "overload\_risk": "number",

#    "thermal\_stress": "number",

#    "operational\_capacity": "number",

#    "maintenance\_dependency": "number",

#    "hard\_failure\_risk": "number",

#    "active\_warnings": "string\[\]",

#    "notes": "string"

#  }

# }

# ---

## **7.8 `MissionState`**

# {

#  "entity\_type": "MissionState",

#  "required\_fields": \[

#    "id",

#    "character\_id",

#    "timeline\_anchor\_id",

#    "status",

#    "primary\_objective",

#    "commitment\_score"

#  \],

#  "fields": {

#    "id": "string",

#    "character\_id": "string",

#    "timeline\_anchor\_id": "string",

#    "status": "enum:mission\_status",

#    "primary\_objective": "string",

#    "secondary\_objectives": "string\[\]",

#    "hidden\_agenda": "string|null",

#    "conflicting\_directives": "string\[\]",

#    "commitment\_score": "number",

#    "abort\_threshold": "number",

#    "notes": "string"

#  }

# }

# ---

## **7.9 `RelationshipState`**

# {

#  "entity\_type": "RelationshipState",

#  "required\_fields": \[

#    "id",

#    "character\_id",

#    "target\_entity\_type",

#    "target\_entity\_id",

#    "timeline\_anchor\_id",

#    "trust\_score",

#    "dependency\_score",

#    "hostility\_score"

#  \],

#  "fields": {

#    "id": "string",

#    "character\_id": "string",

#    "target\_entity\_type": "string",

#    "target\_entity\_id": "string",

#    "timeline\_anchor\_id": "string",

#    "trust\_score": "number",

#    "dependency\_score": "number",

#    "hostility\_score": "number",

#    "grief\_score": "number",

#    "debt\_score": "number",

#    "betrayal\_residue\_score": "number",

#    "bond\_label": "string",

#    "notes": "string"

#  }

# }

# ---

# **8\) STATE VALUE MODEL**

# Để thống nhất engine, dùng quy ước điểm số như sau.

## **8.1 Dải điểm loyalty / relation**

* # `-1.0` \= đối nghịch cực mạnh 

* # `-0.5` \= thù địch 

* # `0.0` \= trung tính 

* # `0.5` \= tin cậy đáng kể 

* # `1.0` \= tuyệt đối 

## **8.2 Dải điểm stress / risk / damage**

* # `0.0` \= không đáng kể 

* # `0.25` \= thấp 

* # `0.5` \= vừa 

* # `0.75` \= cao 

* # `1.0` \= ngưỡng vỡ 

## **8.3 Dải điểm selfhood cohesion**

* # `1.0` \= tự ngã rất ổn định 

* # `0.7` \= có áp lực nhưng vẫn tự kiểm soát 

* # `0.5` \= bắt đầu rạn 

* # `0.3` \= nguy cơ identity drift 

* # `0.1` \= gần phân mảnh 

# ---

# **9\) TRANSITION RULES**

# Đây là lõi logic thật sự.

## **9.1 Transition classes**

* # `injury_applied` 

* # `injury_recovered_partial` 

* # `injury_scar_locked` 

* # `knowledge_acquired` 

* # `knowledge_revised` 

* # `false_belief_formed` 

* # `loyalty_strengthened` 

* # `loyalty_fractured` 

* # `psychological_destabilization` 

* # `psychological_stabilization` 

* # `system_overload` 

* # `system_stabilized` 

* # `mission_diverted` 

* # `visibility_escalated` 

# ---

## **9.2 Transition law**

# Một transition hợp lệ phải có đủ:

* # `trigger_event_id` 

* # `timeline_anchor_id` 

* # `affected_axes` 

* # `causal_basis` 

* # `old_state_ref` 

* # `new_state_ref` 

* # `persistence_class` 

# Nếu thiếu 1 trong các thứ này → reject hoặc warning nặng.

# ---

## **9.3 Allowed causal pattern**

### **Injury**

# `combat/conflict/technology_failure event -> injury record -> physical/system state change -> future capability reduction`

### **Loyalty**

# `betrayal / rescue / command abuse / sacrifice -> trust delta -> stance shift`

### **Knowledge**

# `discovery / confession / recovered memory / surveillance proof -> knowledge item add/update`

### **Psychological**

# `trauma trigger / isolation / repeated pain / relief / reconnection -> psycho delta`

### **Recovery**

# `time + treatment + stabilizer + repair access -> severity decrease`

# ---

## **9.4 Forbidden transition**

* # high injury → full recovery ngay scene sau không có treatment 

* # hostile loyalty → devoted loyalty không có arc 

* # unknown secret → fully verified knowledge không có source 

* # critical overload → zero consequence 

* # fractured selfhood → stable clarity không có stabilizer 

# ---

# **10\) INJURY MODEL**

# Mikage bắt buộc phải có injury model mạnh vì “beauty must carry damage”.

## **10.1 Injury layers**

# Mỗi injury phải được mô tả ở 5 lớp:

# **1\. structural**

* # vết nứt 

* # gãy 

* # rách 

* # hư composite 

* # conduit rupture 

# **2\. functional**

* # giảm mobility 

* # giảm precision 

* # giảm stamina 

* # lệch timing 

* # khó chịu đau 

# **3\. visual**

* # lộ fracture 

* # crimson leakage 

* # cháy cạnh vật liệu 

* # blood / residue / scar 

# **4\. psychological**

* # fear imprint 

* # trauma trigger 

* # heightened caution 

* # rage pressure 

# **5\. persistence**

* # tạm thời 

* # kéo dài 

* # scarred 

* # irreversible 

# ---

## **10.2 Injury severity contract**

### **Low**

* # ảnh hưởng nhẹ 

* # không phá mission core 

* # tồn tại ngắn 

### **Moderate**

* # ảnh hưởng rõ hành vi hoặc combat 

* # cần treatment / adaptation 

### **High**

* # ảnh hưởng đa trục 

* # scene sau bắt buộc phản ánh 

### **Critical**

* # có thể phá mission / identity control / system stability 

* # không được bỏ qua 

### **Terminal**

* # gần chết / không thể tiếp tục như cũ 

# ---

## **10.3 Mikage-specific injury binding**

# Đối với Mikage, các loại injury quan trọng phải bind sang:

* # `physical_state` 

* # `system_state` 

* # `visual appearance consequences` 

* # `combat_state` 

* # `psychological_state` 

# Ví dụ:  `evt_mikage_reactor_body_damage`  phải kéo theo:

* # conduit\_stability giảm 

* # leakage\_visibility tăng 

* # overload\_risk tăng 

* # endurance giảm 

* # trauma\_activation tăng 

* # armor fracture active 

# ---

# **11\) LOYALTY MODEL**

# Loyalty không phải “phe nào”. Nó là ma trận.

## **11.1 Loyalty vector**

# Mỗi target có 6 điểm:

* # `allegiance_score` 

* # `trust_score` 

* # `obedience_score` 

* # `ideological_alignment_score` 

* # `emotional_bond_score` 

* # `betrayal_residue_score` 

## **11.2 Loyalty stance derivation**

# Stance được suy từ vector.

### **devoted**

* # allegiance cao 

* # trust cao 

* # obedience cao 

* # betrayal thấp 

### **aligned**

* # cùng hướng nhưng chưa tuyệt đối 

### **conditional**

* # còn liên kết nhưng tự giữ agency 

### **strained**

* # loyalty tồn tại nhưng trust hoặc obedience giảm mạnh 

### **fractured**

* # còn dây buộc lịch sử nhưng logic liên minh đã nứt 

### **hostile**

* # đã chuyển sang đối nghịch 

# ---

## **11.3 Mikage baseline loyalty logic**

# Mikage không nên có loyalty tuyệt đối kéo dài sau loyalty fracture.  Mặc định phù hợp nhất sau event gãy là:

* # allegiance: còn 

* # trust: giảm mạnh 

* # obedience: giảm rất mạnh 

* # ideological alignment: chọn lọc 

* # betrayal residue: cao 

* # stance: `conditional` hoặc `strained` 

# ---

# **12\) KNOWLEDGE STATE MODEL**

# Knowledge phải được quản như tài sản chiến lược.

## **12.1 Knowledge item fields**

# Mỗi knowledge item cần:

* # biết về cái gì 

* # biết bằng cách nào 

* # độ chắc chắn bao nhiêu 

* # có bị méo / thiếu / sai không 

* # có bị khóa classification không 

## **12.2 Ba loại knowledge quan trọng**

### **verified truth**

# đã thấy / xác minh / có bằng chứng mạnh

### **suspected truth**

# suy đoán mạnh nhưng chưa xác nhận

### **false belief**

# tin sai nhưng đang ảnh hưởng quyết định

# ---

## **12.3 Knowledge acquisition rules**

# Chỉ được add knowledge nếu có:

* # source event 

* # source character 

* # artifact 

* # observation 

* # reasonable inference chain 

# Không được cho character “biết hộ”.

# ---

## **12.4 Knowledge pressure**

# `cognitive_pressure` tăng khi:

* # knowledge mâu thuẫn 

* # secret quá nặng 

* # trauma làm méo memory 

* # false belief chồng verified truth 

# ---

# **13\) TIMELINE SYNC MODEL**

# Character State Tracker phải đồng bộ cứng với World Bible timeline.

## **13.1 Sync sources**

* # `TimelineAnchor` 

* # `Event` 

* # `Relationship` 

* # `CanonRevision` 

## **13.2 Sync law**

# Mỗi snapshot phải gắn:

* # `timeline_anchor_id` 

* # `derived_from_event_ids` 

* # `previous_snapshot_id` 

## **13.3 Rebuild rule**

# Khi event đổi hoặc timeline anchor đổi:

* # state từ mốc đó trở đi phải chạy `cascade recompute` 

## **13.4 State precedence**

# `later snapshot > earlier snapshot`  trừ khi later snapshot bị invalidated.

# ---

# **14\) FILE STRUCTURE**

# /character\_state\_tracker

#  /schemas

#    character\_state\_snapshot.schema.json

#    character\_state\_transition.schema.json

#    injury\_record.schema.json

#    loyalty\_state.schema.json

#    knowledge\_state.schema.json

#    psychological\_state.schema.json

#    system\_state.schema.json

#    mission\_state.schema.json

#    relationship\_state.schema.json

#    state\_validator\_report.schema.json

# 

#  /seed

#    mikage.initial\_state.json

#    mikage.injury.seed.json

#    mikage.loyalty.seed.json

#    mikage.knowledge.seed.json

#    mikage.psychological.seed.json

#    mikage.system.seed.json

#    mikage.mission.seed.json

#    mikage.relationship.seed.json

#    mikage.transition.seed.json

# 

#  /registry

#    state\_enum\_registry.json

#    transition\_registry.json

#    state\_axis\_registry.json

# 

#  /validator

#    state\_integrity.rulepack.json

#    injury.rulepack.json

#    loyalty.rulepack.json

#    knowledge.rulepack.json

#    continuity\_sync.rulepack.json

# 

#  /exports

#    active\_character\_state.snapshot.json

#    state\_diff.snapshot.json

#    injury\_continuity.snapshot.json

#    loyalty\_matrix.snapshot.json

#    knowledge\_visibility.snapshot.json

# 

#  /docs

#    state\_model\_contract.md

#    transition\_laws.md

#    recovery\_rules.md

#    timeline\_sync.md

# ---

# **15\) SEED RECORDS — MIKAGE INITIAL PACK**

# ---

## **15.1 `mikage.initial_state.json`**

# {

#  "id": "state\_char\_mikage\_anchor\_leia\_041",

#  "character\_id": "char\_mikage",

#  "timeline\_anchor\_id": "anchor\_leia\_041",

#  "derived\_from\_event\_ids": \[

#    "evt\_mikage\_foundational\_trauma",

#    "evt\_district\_09\_containment\_breach",

#    "evt\_mikage\_reactor\_body\_damage",

#    "evt\_mikage\_loyalty\_fracture"

#  \],

#  "previous\_snapshot\_id": null,

#  "physical\_state": {

#    "body\_integrity": 0.58,

#    "mobility": 0.74,

#    "pain\_load": 0.77,

#    "fatigue": 0.66,

#    "repair\_status": "stabilized",

#    "active\_injury\_refs": \[

#      "inj\_mikage\_conduit\_torso\_01",

#      "inj\_mikage\_armor\_fracture\_01"

#    \]

#  },

#  "combat\_state": {

#    "precision": 0.82,

#    "endurance": 0.54,

#    "reaction\_stability": 0.71,

#    "weapon\_readiness": 0.88,

#    "constraint\_flags": \[

#      "extended engagement risk",

#      "torso strain under impact"

#    \]

#  },

#  "system\_state": {

#    "conduit\_stability": 0.43,

#    "leakage\_visibility": 0.61,

#    "overload\_risk": 0.72,

#    "thermal\_stress": 0.64,

#    "operational\_capacity": 0.68,

#    "maintenance\_dependency": 0.79,

#    "hard\_failure\_risk": 0.41,

#    "active\_warnings": \[

#      "crimson leakage under armor stress",

#      "reactor strain escalation under prolonged combat"

#    \]

#  },

#  "psychological\_state": {

#    "selfhood\_cohesion": 0.63,

#    "stress\_load": 0.76,

#    "trauma\_activation": 0.71,

#    "rage\_pressure": 0.44,

#    "fear\_load": 0.32,

#    "decision\_clarity": 0.74,

#    "emotional\_compression": 0.88,

#    "active\_flags": \[

#      "compressed",

#      "hypervigilant",

#      "self\_directed\_recovery"

#    \],

#    "behavioral\_risks": \[

#      "refusal of dependency",

#      "trust withholding"

#    \],

#    "stabilizers": \[

#      "discipline routines",

#      "mission focus"

#    \]

#  },

#  "loyalty\_state": {

#    "primary\_alignment": "conditional\_shirogane\_alignment",

#    "active\_loyalty\_refs": \[

#      "loy\_mikage\_shirogane\_anchor\_leia\_041",

#      "loy\_mikage\_selfhood\_anchor\_leia\_041"

#    \]

#  },

#  "knowledge\_state": {

#    "active\_knowledge\_ref": "knw\_mikage\_anchor\_leia\_041"

#  },

#  "relationship\_state\_refs": \[\],

#  "mission\_state": {

#    "active\_mission\_ref": "mis\_mikage\_anchor\_leia\_041"

#  },

#  "visibility\_state": {

#    "public\_identity\_exposure": 0.18,

#    "faction\_traceability": 0.51,

#    "surveillance\_heat": 0.73,

#    "pursuit\_level": 0.47

#  },

#  "active\_constraints": \[

#    "cannot sustain prolonged open combat without system risk",

#    "trust compliance with faction command compromised"

#  \],

#  "state\_confidence": "observed",

#  "notes": "Primary active runtime state after fracture sequence.",

#  "created\_at": "2026-03-14T17:00:00+07:00"

# }

# ---

## **15.2 `mikage.injury.seed.json`**

# \[

#  {

#    "id": "inj\_mikage\_conduit\_torso\_01",

#    "character\_id": "char\_mikage",

#    "event\_id": "evt\_mikage\_reactor\_body\_damage",

#    "timeline\_anchor\_id": "anchor\_leia\_041",

#    "injury\_type": "conduit\_damage",

#    "injury\_region": "torso",

#    "severity": "high",

#    "description": "Internal conduit damage across torso-linked routing channels causing controlled crimson leakage under armor stress.",

#    "functional\_effects": \[

#      "reduced endurance",

#      "overload vulnerability",

#      "elevated pain under high output"

#    \],

#    "visible\_signatures": \[

#      "crimson leakage through armor fracture seams",

#      "localized heat distortion"

#    \],

#    "repair\_requirements": \[

#      "specialized conduit stabilization",

#      "composite resealing"

#    \],

#    "recovery\_state": "stabilized",

#    "persistence": "long-term recurring under stress",

#    "scar\_probability": 0.84,

#    "canon\_notes": "Core injury for visual and systemic continuity."

#  },

#  {

#    "id": "inj\_mikage\_armor\_fracture\_01",

#    "character\_id": "char\_mikage",

#    "event\_id": "evt\_mikage\_reactor\_body\_damage",

#    "timeline\_anchor\_id": "anchor\_leia\_041",

#    "injury\_type": "composite\_armor\_failure",

#    "injury\_region": "torso",

#    "severity": "moderate",

#    "description": "Fracture propagation through porcelain composite plating exposing internal reinforcement and leak paths.",

#    "functional\_effects": \[

#      "reduced protection at impacted zones",

#      "visible vulnerability markers"

#    \],

#    "visible\_signatures": \[

#      "fractured white ceramic lines",

#      "black reinforcement exposure"

#    \],

#    "repair\_requirements": \[

#      "ceramic plate replacement",

#      "fracture stabilization"

#    \],

#    "recovery\_state": "repairing",

#    "persistence": "persists until structured repair cycle",

#    "scar\_probability": 0.62,

#    "canon\_notes": "Beauty must carry damage."

#  }

# \]

# ---

## **15.3 `mikage.loyalty.seed.json`**

# \[

#  {

#    "id": "loy\_mikage\_shirogane\_anchor\_leia\_041",

#    "character\_id": "char\_mikage",

#    "timeline\_anchor\_id": "anchor\_leia\_041",

#    "primary\_target\_type": "Faction",

#    "primary\_target\_id": "fct\_shirogane\_remnant",

#    "allegiance\_score": 0.46,

#    "trust\_score": 0.12,

#    "obedience\_score": 0.08,

#    "ideological\_alignment\_score": 0.41,

#    "emotional\_bond\_score": 0.19,

#    "betrayal\_residue\_score": 0.81,

#    "stance": "conditional",

#    "causal\_drivers": \[

#      "foundational betrayal",

#      "survival debt to training history",

#      "rejection of blind obedience"

#    \],

#    "notes": "Still linked, no longer owned."

#  },

#  {

#    "id": "loy\_mikage\_selfhood\_anchor\_leia\_041",

#    "character\_id": "char\_mikage",

#    "timeline\_anchor\_id": "anchor\_leia\_041",

#    "primary\_target\_type": "Concept",

#    "primary\_target\_id": "selfhood\_preservation",

#    "allegiance\_score": 0.92,

#    "trust\_score": 0.77,

#    "obedience\_score": 0.83,

#    "ideological\_alignment\_score": 0.88,

#    "emotional\_bond\_score": 0.71,

#    "betrayal\_residue\_score": 0.00,

#    "stance": "aligned",

#    "causal\_drivers": \[

#      "survival through agency",

#      "identity preservation imperative"

#    \],

#    "notes": "Selfhood now outranks institution."

#  }

# \]

# ---

## **15.4 `mikage.knowledge.seed.json`**

# {

#  "id": "knw\_mikage\_anchor\_leia\_041",

#  "character\_id": "char\_mikage",

#  "timeline\_anchor\_id": "anchor\_leia\_041",

#  "knowledge\_items": \[

#    {

#      "knowledge\_id": "k\_mikage\_shirogane\_operational\_duplicitous",

#      "subject\_type": "Faction",

#      "subject\_id": "fct\_shirogane\_remnant",

#      "knowledge\_type": "suspected\_truth",

#      "access\_level": "classified",

#      "source\_event\_id": "evt\_mikage\_foundational\_trauma",

#      "source\_character\_id": null,

#      "confidence\_score": 0.72,

#      "summary": "Shirogane command structures may preserve doctrine above the selfhood of operatives."

#    },

#    {

#      "knowledge\_id": "k\_mikage\_body\_damage\_real",

#      "subject\_type": "Event",

#      "subject\_id": "evt\_mikage\_reactor\_body\_damage",

#      "knowledge\_type": "verified\_truth",

#      "access\_level": "restricted",

#      "source\_event\_id": "evt\_mikage\_reactor\_body\_damage",

#      "source\_character\_id": null,

#      "confidence\_score": 0.99,

#      "summary": "Her own reactor-linked body damage is persistent and cannot be treated as temporary cosmetic injury."

#    },

#    {

#      "knowledge\_id": "k\_mikage\_kurovas\_lockdown\_pattern",

#      "subject\_type": "Faction",

#      "subject\_id": "fct\_kurovas\_industrial\_directorate",

#      "knowledge\_type": "partial\_model",

#      "access\_level": "restricted",

#      "source\_event\_id": "evt\_district\_09\_containment\_breach",

#      "source\_character\_id": null,

#      "confidence\_score": 0.67,

#      "summary": "Kurovas escalates surveillance and route denial after industrial breach events."

#    }

#  \],

#  "uncertainty\_map": \[

#    {

#      "subject\_id": "fct\_helios\_recovery\_bureau",

#      "uncertainty\_reason": "indirect involvement suspected but incompletely resolved",

#      "severity": 0.61

#    }

#  \],

#  "missing\_critical\_knowledge": \[

#    "full chain of betrayal responsibility",

#    "true scope of Shirogane identity-lock doctrine"

#  \],

#  "false\_belief\_load": 0.11,

#  "cognitive\_pressure": 0.58,

#  "notes": "Knowledge profile under strain but operational."

# }

# ---

## **15.5 `mikage.psychological.seed.json`**

# {

#  "id": "psy\_mikage\_anchor\_leia\_041",

#  "character\_id": "char\_mikage",

#  "timeline\_anchor\_id": "anchor\_leia\_041",

#  "selfhood\_cohesion": 0.63,

#  "stress\_load": 0.76,

#  "trauma\_activation": 0.71,

#  "rage\_pressure": 0.44,

#  "fear\_load": 0.32,

#  "decision\_clarity": 0.74,

#  "emotional\_compression": 0.88,

#  "active\_flags": \[

#    "compressed",

#    "hypervigilant",

#    "self\_directed\_recovery"

#  \],

#  "behavioral\_risks": \[

#    "silent withdrawal under trust pressure",

#    "excessive self-burdening"

#  \],

#  "stabilizers": \[

#    "combat discipline",

#    "narrowed mission logic",

#    "identity refusal against submission"

#  \],

#  "notes": "Stable enough to act, unstable enough to scar every choice."

# }

# ---

## **15.6 `mikage.system.seed.json`**

# {

#  "id": "sys\_mikage\_anchor\_leia\_041",

#  "character\_id": "char\_mikage",

#  "timeline\_anchor\_id": "anchor\_leia\_041",

#  "conduit\_stability": 0.43,

#  "leakage\_visibility": 0.61,

#  "overload\_risk": 0.72,

#  "thermal\_stress": 0.64,

#  "operational\_capacity": 0.68,

#  "maintenance\_dependency": 0.79,

#  "hard\_failure\_risk": 0.41,

#  "active\_warnings": \[

#    "visible crimson signature under severe fracture stress",

#    "power routing instability during prolonged exertion"

#  \],

#  "notes": "Damage is survivable, not ignorable."

# }

# ---

## **15.7 `mikage.mission.seed.json`**

# {

#  "id": "mis\_mikage\_anchor\_leia\_041",

#  "character\_id": "char\_mikage",

#  "timeline\_anchor\_id": "anchor\_leia\_041",

#  "status": "diverted",

#  "primary\_objective": "survive while preserving selfhood against institutional capture",

#  "secondary\_objectives": \[

#    "avoid full Kurovas detection",

#    "retain maneuver capacity",

#    "verify betrayal chain"

#  \],

#  "hidden\_agenda": "identify whether loyalty can exist without submission",

#  "conflicting\_directives": \[

#    "legacy Shirogane command expectations"

#  \],

#  "commitment\_score": 0.91,

#  "abort\_threshold": 0.14,

#  "notes": "Mission logic now centered on agency."

# }

# ---

## **15.8 `mikage.transition.seed.json`**

# \[

#  {

#    "id": "trn\_mikage\_body\_damage\_anchor\_leia\_041",

#    "character\_id": "char\_mikage",

#    "timeline\_anchor\_id": "anchor\_leia\_041",

#    "trigger\_event\_id": "evt\_mikage\_reactor\_body\_damage",

#    "transition\_type": "injury\_applied",

#    "affected\_axes": \[

#      "physical\_state",

#      "combat\_state",

#      "system\_state",

#      "psychological\_state",

#      "visual\_continuity"

#    \],

#    "old\_state\_ref": null,

#    "new\_state\_ref": "state\_char\_mikage\_anchor\_leia\_041",

#    "causal\_basis": "Combat-linked reactor routing stress exceeded safe threshold, resulting in persistent internal conduit damage and armor fracture.",

#    "reversibility": "partial",

#    "persistence\_class": "long\_term",

#    "state\_confidence": "observed",

#    "notes": "Core continuity transition."

#  },

#  {

#    "id": "trn\_mikage\_loyalty\_fracture\_anchor\_leia\_041",

#    "character\_id": "char\_mikage",

#    "timeline\_anchor\_id": "anchor\_leia\_041",

#    "trigger\_event\_id": "evt\_mikage\_loyalty\_fracture",

#    "transition\_type": "loyalty\_fractured",

#    "affected\_axes": \[

#      "loyalty\_state",

#      "mission\_state",

#      "psychological\_state"

#    \],

#    "old\_state\_ref": null,

#    "new\_state\_ref": "state\_char\_mikage\_anchor\_leia\_041",

#    "causal\_basis": "Blind obedience became incompatible with survival of selfhood after betrayal and body damage accumulation.",

#    "reversibility": "difficult",

#    "persistence\_class": "structural",

#    "state\_confidence": "inferred\_high",

#    "notes": "Foundational stance shift."

#  }

# \]

# ---

# **16\) JSON SCHEMA TEMPLATES**

## **16.1 `character_state_snapshot.schema.json`**

# {

#  "$schema": "http://json-schema.org/draft-07/schema\#",

#  "title": "CharacterStateSnapshot",

#  "type": "object",

#  "required": \[

#    "id",

#    "character\_id",

#    "timeline\_anchor\_id",

#    "derived\_from\_event\_ids",

#    "physical\_state",

#    "combat\_state",

#    "system\_state",

#    "psychological\_state",

#    "loyalty\_state",

#    "knowledge\_state",

#    "mission\_state",

#    "visibility\_state",

#    "state\_confidence",

#    "created\_at"

#  \],

#  "properties": {

#    "id": { "type": "string", "pattern": "^state\_\[a-z0-9\_\]+$" },

#    "character\_id": { "type": "string", "pattern": "^char\_\[a-z0-9\_\]+$" },

#    "timeline\_anchor\_id": { "type": "string", "pattern": "^anchor\_\[a-z0-9\_\]+$" },

#    "derived\_from\_event\_ids": {

#      "type": "array",

#      "items": { "type": "string", "pattern": "^evt\_\[a-z0-9\_\]+$" }

#    },

#    "previous\_snapshot\_id": {

#      "type": \["string", "null"\]

#    },

#    "physical\_state": { "type": "object" },

#    "combat\_state": { "type": "object" },

#    "system\_state": { "type": "object" },

#    "psychological\_state": { "type": "object" },

#    "loyalty\_state": { "type": "object" },

#    "knowledge\_state": { "type": "object" },

#    "relationship\_state\_refs": {

#      "type": "array",

#      "items": { "type": "string" }

#    },

#    "mission\_state": { "type": "object" },

#    "visibility\_state": { "type": "object" },

#    "active\_constraints": {

#      "type": "array",

#      "items": { "type": "string" }

#    },

#    "state\_confidence": {

#      "type": "string",

#      "enum": \["observed", "inferred\_high", "inferred\_medium", "reported", "uncertain"\]

#    },

#    "notes": { "type": "string" },

#    "created\_at": { "type": "string" }

#  },

#  "additionalProperties": false

# }

## **16.2 `injury_record.schema.json`**

# {

#  "$schema": "http://json-schema.org/draft-07/schema\#",

#  "title": "InjuryRecord",

#  "type": "object",

#  "required": \[

#    "id",

#    "character\_id",

#    "event\_id",

#    "timeline\_anchor\_id",

#    "injury\_type",

#    "injury\_region",

#    "severity",

#    "functional\_effects",

#    "recovery\_state",

#    "persistence"

#  \],

#  "properties": {

#    "id": { "type": "string", "pattern": "^inj\_\[a-z0-9\_\]+$" },

#    "character\_id": { "type": "string", "pattern": "^char\_\[a-z0-9\_\]+$" },

#    "event\_id": { "type": "string", "pattern": "^evt\_\[a-z0-9\_\]+$" },

#    "timeline\_anchor\_id": { "type": "string", "pattern": "^anchor\_\[a-z0-9\_\]+$" },

#    "injury\_type": {

#      "type": "string",

#      "enum": \[

#        "blunt\_impact",

#        "laceration",

#        "fracture",

#        "burn",

#        "conduit\_damage",

#        "neural\_stress",

#        "organ\_damage",

#        "systemic\_overload",

#        "composite\_armor\_failure"

#      \]

#    },

#    "injury\_region": {

#      "type": "string",

#      "enum": \[

#        "head",

#        "face",

#        "torso",

#        "left\_arm",

#        "right\_arm",

#        "left\_leg",

#        "right\_leg",

#        "spinal\_axis",

#        "internal\_system",

#        "full\_body"

#      \]

#    },

#    "severity": {

#      "type": "string",

#      "enum": \["none", "low", "moderate", "high", "critical", "terminal"\]

#    },

#    "description": { "type": "string" },

#    "functional\_effects": {

#      "type": "array",

#      "minItems": 1,

#      "items": { "type": "string" }

#    },

#    "visible\_signatures": {

#      "type": "array",

#      "items": { "type": "string" }

#    },

#    "repair\_requirements": {

#      "type": "array",

#      "items": { "type": "string" }

#    },

#    "recovery\_state": {

#      "type": "string",

#      "enum": \["untreated", "stabilized", "repairing", "scarred", "adapted", "degraded", "irreversible"\]

#    },

#    "persistence": { "type": "string" },

#    "scar\_probability": { "type": "number", "minimum": 0, "maximum": 1 },

#    "canon\_notes": { "type": "string" }

#  },

#  "additionalProperties": false

# }

## **16.3 `loyalty_state.schema.json`**

# {

#  "$schema": "http://json-schema.org/draft-07/schema\#",

#  "title": "LoyaltyState",

#  "type": "object",

#  "required": \[

#    "id",

#    "character\_id",

#    "timeline\_anchor\_id",

#    "primary\_target\_type",

#    "primary\_target\_id",

#    "allegiance\_score",

#    "trust\_score",

#    "obedience\_score",

#    "ideological\_alignment\_score",

#    "stance"

#  \],

#  "properties": {

#    "id": { "type": "string", "pattern": "^loy\_\[a-z0-9\_\]+$" },

#    "character\_id": { "type": "string", "pattern": "^char\_\[a-z0-9\_\]+$" },

#    "timeline\_anchor\_id": { "type": "string", "pattern": "^anchor\_\[a-z0-9\_\]+$" },

#    "primary\_target\_type": { "type": "string" },

#    "primary\_target\_id": { "type": "string" },

#    "allegiance\_score": { "type": "number", "minimum": \-1, "maximum": 1 },

#    "trust\_score": { "type": "number", "minimum": \-1, "maximum": 1 },

#    "obedience\_score": { "type": "number", "minimum": \-1, "maximum": 1 },

#    "ideological\_alignment\_score": { "type": "number", "minimum": \-1, "maximum": 1 },

#    "emotional\_bond\_score": { "type": "number", "minimum": \-1, "maximum": 1 },

#    "betrayal\_residue\_score": { "type": "number", "minimum": 0, "maximum": 1 },

#    "stance": {

#      "type": "string",

#      "enum": \["devoted", "aligned", "conditional", "strained", "fractured", "hostile", "unknown"\]

#    },

#    "causal\_drivers": {

#      "type": "array",

#      "items": { "type": "string" }

#    },

#    "notes": { "type": "string" }

#  },

#  "additionalProperties": false

# }

# ---

# **17\) VALIDATOR RULEPACKS**

## **17.1 `state_integrity.rulepack.json`**

# {

#  "rulepack\_id": "character\_state\_integrity\_v1",

#  "rules": \[

#    {

#      "id": "st\_snapshot\_requires\_existing\_character",

#      "severity": "fatal",

#      "description": "Every snapshot must reference an existing character."

#    },

#    {

#      "id": "st\_snapshot\_requires\_timeline\_anchor",

#      "severity": "fatal",

#      "description": "Every snapshot must bind to a valid timeline anchor."

#    },

#    {

#      "id": "st\_transition\_requires\_trigger",

#      "severity": "fatal",

#      "description": "Every transition must have a valid trigger event."

#    },

#    {

#      "id": "st\_latest\_snapshot\_must\_be\_unique\_per\_anchor",

#      "severity": "critical",

#      "description": "Only one active authoritative snapshot per character per anchor."

#    },

#    {

#      "id": "st\_constraints\_must\_match\_state\_axes",

#      "severity": "major",

#      "description": "Declared active constraints must be explainable by state values."

#    }

#  \]

# }

## **17.2 `injury.rulepack.json`**

# {

#  "rulepack\_id": "character\_state\_injury\_v1",

#  "rules": \[

#    {

#      "id": "inj\_major\_injury\_requires\_functional\_effect",

#      "severity": "fatal",

#      "description": "Moderate or higher injuries must alter function."

#    },

#    {

#      "id": "inj\_visual\_signature\_required\_for\_mikage\_core\_damage",

#      "severity": "critical",

#      "description": "Mikage high-value damage must produce visible continuity markers."

#    },

#    {

#      "id": "inj\_recovery\_cannot\_skip\_mechanism",

#      "severity": "fatal",

#      "description": "Recovery cannot occur without time, treatment, adaptation, or repair basis."

#    },

#    {

#      "id": "inj\_persistent\_damage\_must\_affect\_future\_snapshot",

#      "severity": "critical",

#      "description": "Persistent injury must propagate into later states."

#    }

#  \]

# }

## **17.3 `loyalty.rulepack.json`**

# {

#  "rulepack\_id": "character\_state\_loyalty\_v1",

#  "rules": \[

#    {

#      "id": "loy\_stance\_must\_match\_scores",

#      "severity": "fatal",

#      "description": "Loyalty stance must be derivable from loyalty vector."

#    },

#    {

#      "id": "loy\_major\_shift\_requires\_causal\_chain",

#      "severity": "critical",

#      "description": "Large loyalty shifts require betrayal, rescue, revelation, or equivalent cause."

#    },

#    {

#      "id": "loy\_betrayal\_residue\_blocks\_instant\_devotion",

#      "severity": "fatal",

#      "description": "High betrayal residue prevents immediate return to devoted stance."

#    }

#  \]

# }

## **17.4 `knowledge.rulepack.json`**

# {

#  "rulepack\_id": "character\_state\_knowledge\_v1",

#  "rules": \[

#    {

#      "id": "knw\_no\_free\_knowledge",

#      "severity": "fatal",

#      "description": "Knowledge cannot appear without source event, source actor, artifact, or inference basis."

#    },

#    {

#      "id": "knw\_false\_belief\_must\_affect\_decision\_context",

#      "severity": "major",

#      "description": "Non-trivial false beliefs must influence mission or psychological logic."

#    },

#    {

#      "id": "knw\_classified\_truth\_requires\_access\_basis",

#      "severity": "critical",

#      "description": "Classified knowledge requires plausible access route."

#    }

#  \]

# }

## **17.5 `continuity_sync.rulepack.json`**

# {

#  "rulepack\_id": "character\_state\_continuity\_sync\_v1",

#  "rules": \[

#    {

#      "id": "sync\_event\_order\_must\_match\_state\_order",

#      "severity": "fatal",

#      "description": "State transitions must not violate event timeline order."

#    },

#    {

#      "id": "sync\_world\_bible\_revision\_triggers\_recompute",

#      "severity": "critical",

#      "description": "Relevant world bible changes force downstream state recomputation."

#    },

#    {

#      "id": "sync\_injury\_event\_requires\_injury\_record",

#      "severity": "critical",

#      "description": "Any major injury event must generate at least one injury record."

#    },

#    {

#      "id": "sync\_loyalty\_fracture\_event\_requires\_loyalty\_delta",

#      "severity": "critical",

#      "description": "Faction shift or loyalty fracture events must change loyalty state."

#    }

#  \]

# }

# ---

# **18\) DERIVATION LOGIC**

# Đây là logic để engine tự suy `active_state`.

## **18.1 Priority stack**

1. # latest valid snapshot 

2. # latest valid transitions after snapshot 

3. # unresolved persistent injuries 

4. # latest loyalty state per target 

5. # latest knowledge state 

6. # revision overrides 

## **18.2 Derived flags examples**

### **`combat_compromised`**

# true nếu:

* # endurance \< 0.6 

* # hoặc overload\_risk \> 0.7 

* # hoặc pain\_load \> 0.75 

### **`identity_fragility_warning`**

# true nếu:

* # selfhood\_cohesion \< 0.45 

* # hoặc trauma\_activation \> 0.8 

### **`command_noncompliance_risk`**

# true nếu:

* # obedience\_score \< 0.2 

* # và betrayal\_residue\_score \> 0.6 

# ---

# **19\) OUTPUT CONTRACTS CHO HỆ KHÁC**

## **19.1 Cho narrative engine**

# trả:

* # active emotional burdens 

* # unresolved injuries 

* # trust map 

* # knowledge gaps 

* # action constraints 

## **19.2 Cho cinematic adaptation layer**

# trả:

* # visible damage markers 

* # posture constraints 

* # motion constraints 

* # energy leakage visibility 

* # facial/body concealment logic 

## **19.3 Cho prompt compiler**

# trả:

* # allowed visual damage state 

* # armor integrity condition 

* # crimson intensity cap 

* # fatigue/body strain cues 

## **19.4 Cho validator**

# trả:

* # contradiction list 

* # state missing consequence report 

* # impossible recovery alert 

* # illegal knowledge alert 

# ---

# **20\) MIKAGE-SPECIFIC RUNTIME READING**

# Tại anchor hiện tại `anchor_leia_041`, Mikage nên được đọc như sau:

* # **body**: còn chiến đấu được nhưng không còn nguyên vẹn 

* # **system**: có crimson leakage do damage, không phải power fantasy 

* # **psyche**: nén cảm xúc cực mạnh nhưng chưa tan rã 

* # **loyalty**: không còn phục tùng mù quáng 

* # **knowledge**: biết đủ để nghi ngờ hệ, chưa biết toàn bộ sự thật 

* # **mission**: ưu tiên giữ selfhood hơn phục tùng cơ chế 

# Đây là trạng thái chuẩn để mọi narrative và cinematic scene bám vào.

# ---

# **21\) BẢN CHỐT KỸ THUẬT**

# Character State Tracker Pack này đã đủ để:

* # khóa continuity của nhân vật 

* # biến injury thành hậu quả thật 

* # biến loyalty thành hệ logic thay vì cảm hứng 

* # biến knowledge thành tài sản có nguồn gốc 

* # đồng bộ chặt với World Bible timeline 

* # cấp runtime state thật cho Narrative Engine và Cinematic Layer

# 

