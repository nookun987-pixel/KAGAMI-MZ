 **0\. MỤC TIÊU HỆ**

Cinematic Adaptation Layer là lớp chuyển đổi:

**Narrative truth**  
 → **scene truth**  
 → **shot truth**  
 → **visual state truth**  
 → **prompt pack**  
 → **image/video generation input**

Nó tồn tại để giải quyết 6 việc:

1. biến story beat thành scene có thể quay / render

2. biến scene thành shot grammar có kiểm soát

3. map runtime character state sang hình ảnh

4. khóa location / era / mood / lens / framing theo canon

5. compile prompt pack nhất quán cho image/video/trailer

6. chặn drift giữa prose và visual output

---

# **1\. PACK STRUCTURE**

/cinematic\_adaptation\_layer/  
 README.md

 /schemas/  
   scene.schema.json  
   shot.schema.json  
   scene\_beat\_map.schema.json  
   cinematic\_state\_map.schema.json  
   visual\_intent.schema.json  
   prompt\_pack.schema.json  
   shot\_sequence.schema.json  
   trailer\_plan.schema.json  
   trailer\_beat.schema.json  
   adaptation\_report.schema.json

 /grammars/  
   shot\_grammar.json  
   camera\_grammar.json  
   lighting\_grammar.json  
   motion\_grammar.json  
   composition\_grammar.json  
   location\_cinematic\_grammar.json  
   character\_visual\_grammar.json  
   era\_visual\_grammar.json  
   transition\_grammar.json

 /mappings/  
   narrative\_to\_scene.mapping.json  
   scene\_to\_shot.mapping.json  
   state\_to\_visual.mapping.json  
   emotion\_to\_cinematic\_signal.mapping.json  
   injury\_to\_visual\_signal.mapping.json  
   loyalty\_to\_blocking.mapping.json  
   knowledge\_to\_reveal.mapping.json  
   environment\_to\_lighting.mapping.json

 /compiler/  
   cinematic\_prompt\_compiler.spec.json  
   prompt\_assembly\_order.json  
   negative\_profile.cinematic.json  
   modality\_profiles.json  
   render\_intent\_profiles.json

 /trailer/  
   trailer\_conversion\_logic.json  
   trailer\_structure\_presets.json  
   trailer\_rhythm\_profiles.json  
   trailer\_audio\_direction.json  
   trailer\_text\_card\_logic.json  
   trailer\_escalation\_rules.json

 /validators/  
   cinematic\_validator.rulepack.json  
   cinematic\_validator.layers.json  
   cinematic\_validator.severity.json  
   cinematic\_validator.enums.json

 /seed/  
   scene\_templates.seed.json  
   shot\_templates.seed.json  
   location\_cinematic\_profiles.seed.json  
   mikage\_visual\_state\_profiles.seed.json  
   trailer\_presets.seed.json

 /examples/  
   scene\_example\_mikage\_rooftop.json  
   shot\_sequence\_mikage\_rooftop.json  
   prompt\_pack\_mikage\_rooftop.json  
   trailer\_plan\_mikage\_rooftop.json

 /reports/  
   adaptation\_report.example.json  
---

# **2\. CORE DATA FLOW**

## **2.1 Upstream inputs**

Cinematic Adaptation Layer nhận dữ liệu từ:

* World Bible Database

* Character State Tracker

* Narrative Engine

* Prompt Compiler registries

* Canon Validator System

* Visual DNA lock

* Location / Era / Faction canon

## **2.2 Output objects**

Layer này sinh ra:

* `Scene`

* `ShotSequence`

* `CinematicStateMap`

* `PromptPack`

* `TrailerPlan`

* `AdaptationReport`

---

# **3\. SCENE SCHEMA**

## **3.1 Vai trò**

`Scene` là đơn vị cinematic trung gian giữa narrative beat và shot sequence.  
 Một scene phải là **narrative truth translated into renderable visual event**.

## **3.2 scene.schema.json**

{  
 "$id": "scene.schema.json",  
 "type": "object",  
 "required": \[  
   "scene\_id",  
   "source\_story\_arc\_id",  
   "source\_sequence\_id",  
   "timeline\_anchor\_id",  
   "scene\_type",  
   "canonical\_purpose",  
   "dramatic\_function",  
   "location\_id",  
   "era\_id",  
   "time\_of\_day",  
   "environment\_conditions",  
   "participating\_characters",  
   "character\_state\_refs",  
   "conflict\_axis",  
   "visual\_intent",  
   "state\_pressure",  
   "scene\_beats",  
   "cinematic\_priority",  
   "continuity\_inputs",  
   "continuity\_outputs",  
   "canon\_constraints",  
   "adaptation\_status"  
 \],  
 "properties": {  
   "scene\_id": { "type": "string" },  
   "source\_story\_arc\_id": { "type": "string" },  
   "source\_sequence\_id": { "type": "string" },  
   "timeline\_anchor\_id": { "type": "string" },

   "scene\_type": {  
     "type": "string",  
     "enum": \[  
       "confrontation",  
       "revelation",  
       "transition",  
       "pursuit",  
       "combat",  
       "aftermath",  
       "ritualized\_standoff",  
       "infiltration",  
       "escape",  
       "collapse",  
       "memory\_fragment"  
     \]  
   },

   "canonical\_purpose": { "type": "string" },  
   "dramatic\_function": {  
     "type": "string",  
     "enum": \[  
       "introduce\_pressure",  
       "escalate\_conflict",  
       "reveal\_truth",  
       "reverse\_alignment",  
       "test\_identity",  
       "display\_cost",  
       "transition\_state",  
       "prepare\_climax",  
       "deliver\_aftermath"  
     \]  
   },

   "location\_id": { "type": "string" },  
   "era\_id": { "type": "string" },  
   "time\_of\_day": { "type": "string" },  
   "environment\_conditions": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "participating\_characters": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "character\_state\_refs": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "conflict\_axis": {  
     "type": "array",  
     "items": {  
       "type": "string",  
       "enum": \[  
         "memory\_vs\_identity",  
         "body\_vs\_self",  
         "order\_vs\_freedom",  
         "beauty\_vs\_cruelty",  
         "love\_vs\_possession",  
         "sacrifice\_vs\_self\_destruction"  
       \]  
     }  
   },

   "visual\_intent": { "$ref": "visual\_intent.schema.json" },

   "state\_pressure": {  
     "type": "object",  
     "required": \[  
       "physical\_pressure",  
       "psychological\_pressure",  
       "systemic\_pressure",  
       "social\_pressure"  
     \],  
     "properties": {  
       "physical\_pressure": { "type": "integer", "minimum": 0, "maximum": 100 },  
       "psychological\_pressure": { "type": "integer", "minimum": 0, "maximum": 100 },  
       "systemic\_pressure": { "type": "integer", "minimum": 0, "maximum": 100 },  
       "social\_pressure": { "type": "integer", "minimum": 0, "maximum": 100 }  
     }  
   },

   "scene\_beats": {  
     "type": "array",  
     "items": { "$ref": "scene\_beat\_map.schema.json" }  
   },

   "cinematic\_priority": {  
     "type": "string",  
     "enum": \[  
       "character\_revelation",  
       "state\_display",  
       "world\_scale",  
       "combat\_clarity",  
       "psychological\_tension",  
       "symbolic\_image"  
     \]  
   },

   "continuity\_inputs": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "continuity\_outputs": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "canon\_constraints": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "adaptation\_status": {  
     "type": "string",  
     "enum": \[  
       "draft",  
       "validated",  
       "blocked",  
       "compiled",  
       "render\_ready"  
     \]  
   }  
 }  
}  
---

# **4\. SCENE BEAT MODEL**

## **4.1 scene\_beat\_map.schema.json**

{  
 "$id": "scene\_beat\_map.schema.json",  
 "type": "object",  
 "required": \[  
   "beat\_id",  
   "beat\_order",  
   "beat\_type",  
   "narrative\_action",  
   "visible\_action",  
   "state\_delta",  
   "shot\_intent",  
   "reveal\_level"  
 \],  
 "properties": {  
   "beat\_id": { "type": "string" },  
   "beat\_order": { "type": "integer", "minimum": 1 },  
   "beat\_type": {  
     "type": "string",  
     "enum": \[  
       "arrival",  
       "scan",  
       "stillness",  
       "micro\_reaction",  
       "verbal\_exchange",  
       "escalation",  
       "impact",  
       "injury\_reveal",  
       "alignment\_shift",  
       "memory\_trigger",  
       "withdrawal",  
       "collapse",  
       "exit"  
     \]  
   },  
   "narrative\_action": { "type": "string" },  
   "visible\_action": { "type": "string" },  
   "state\_delta": {  
     "type": "array",  
     "items": { "type": "string" }  
   },  
   "shot\_intent": {  
     "type": "string",  
     "enum": \[  
       "establish",  
       "intensify",  
       "clarify",  
       "conceal",  
       "reveal",  
       "isolate",  
       "monumentalize",  
       "destabilize"  
     \]  
   },  
   "reveal\_level": {  
     "type": "string",  
     "enum": \["none", "partial", "controlled", "explicit"\]  
   }  
 }  
}  
---

# **5\. SHOT GRAMMAR**

## **5.1 Nguyên tắc**

Shot không được “đẹp tùy hứng”.  
 Shot là **canonical visual language unit**.

Mọi shot phải trả lời được 6 câu:

1. đang cho thấy ai / cái gì

2. cho thấy ở cấp độ nào

3. cảm giác quyền lực nằm ở đâu

4. state nào đang bị lộ ra

5. information nào bị che đi

6. frame này phục vụ dramatic function nào

## **5.2 shot.schema.json**

{  
 "$id": "shot.schema.json",  
 "type": "object",  
 "required": \[  
   "shot\_id",  
   "scene\_id",  
   "shot\_order",  
   "shot\_type",  
   "camera\_distance",  
   "camera\_angle",  
   "lens\_profile",  
   "composition\_profile",  
   "subject\_focus",  
   "blocking",  
   "motion\_profile",  
   "lighting\_profile",  
   "state\_visibility",  
   "environment\_visibility",  
   "canon\_flags",  
   "prompt\_role"  
 \],  
 "properties": {  
   "shot\_id": { "type": "string" },  
   "scene\_id": { "type": "string" },  
   "shot\_order": { "type": "integer", "minimum": 1 },

   "shot\_type": {  
     "type": "string",  
     "enum": \[  
       "establishing",  
       "wide\_monumental",  
       "medium\_tension",  
       "close\_emotional",  
       "insert\_detail",  
       "over\_shoulder",  
       "tracking",  
       "low\_angle\_heroic",  
       "high\_angle\_vulnerability",  
       "silhouette",  
       "reaction",  
       "impact",  
       "aftermath\_hold"  
     \]  
   },

   "camera\_distance": {  
     "type": "string",  
     "enum": \[  
       "extreme\_wide",  
       "wide",  
       "medium\_wide",  
       "medium",  
       "medium\_close",  
       "close\_up",  
       "extreme\_close\_up"  
     \]  
   },

   "camera\_angle": {  
     "type": "string",  
     "enum": \[  
       "eye\_level",  
       "low\_angle",  
       "high\_angle",  
       "oblique",  
       "top\_down",  
       "ground\_skimming"  
     \]  
   },

   "lens\_profile": {  
     "type": "string",  
     "enum": \[  
       "anamorphic\_wide",  
       "anamorphic\_standard",  
       "compressed\_telephoto",  
       "macro\_detail",  
       "handheld\_observational"  
     \]  
   },

   "composition\_profile": {  
     "type": "string",  
     "enum": \[  
       "central\_monument",  
       "off\_axis\_tension",  
       "negative\_space\_isolation",  
       "layered\_depth",  
       "foreground\_occlusion",  
       "symmetry\_broken\_by\_damage"  
     \]  
   },

   "subject\_focus": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "blocking": {  
     "type": "string",  
     "enum": \[  
       "still\_dominant",  
       "guarded\_forward",  
       "retreat\_vector",  
       "collision\_line",  
       "side\_profile\_resistance",  
       "kneel\_or\_collapse",  
       "elevated\_edge\_position"  
     \]  
   },

   "motion\_profile": {  
     "type": "string",  
     "enum": \[  
       "locked\_frame",  
       "slow\_push",  
       "lateral\_track",  
       "orbit\_controlled",  
       "handheld\_shock",  
       "crane\_descend",  
       "rise\_reveal"  
     \]  
   },

   "lighting\_profile": {  
     "type": "string",  
     "enum": \[  
       "hard\_chiaroscuro",  
       "backlit\_rain",  
       "industrial\_toplight",  
       "sodium\_falloff",  
       "reactor\_leak\_accent",  
       "fog\_diffused\_contrast"  
     \]  
   },

   "state\_visibility": {  
     "type": "object",  
     "required": \[  
       "injury\_visibility",  
       "emotion\_visibility",  
       "system\_damage\_visibility",  
       "loyalty\_visibility",  
       "knowledge\_visibility"  
     \],  
     "properties": {  
       "injury\_visibility": { "type": "string", "enum": \["hidden", "hinted", "visible", "explicit"\] },  
       "emotion\_visibility": { "type": "string", "enum": \["hidden", "contained", "visible", "ruptured"\] },  
       "system\_damage\_visibility": { "type": "string", "enum": \["none", "hinted", "visible", "dominant"\] },  
       "loyalty\_visibility": { "type": "string", "enum": \["none", "inferred", "implied", "declared"\] },  
       "knowledge\_visibility": { "type": "string", "enum": \["concealed", "partial", "revealed"\] }  
     }  
   },

   "environment\_visibility": {  
     "type": "string",  
     "enum": \[  
       "minimal",  
       "supportive",  
       "worldbuilding\_forward",  
       "scale\_dominant"  
     \]  
   },

   "canon\_flags": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "prompt\_role": {  
     "type": "string",  
     "enum": \[  
       "hero\_frame",  
       "state\_frame",  
       "transition\_frame",  
       "trailer\_anchor",  
       "environment\_plate",  
       "detail\_insert"  
     \]  
   }  
 }  
}  
---

## **5.3 shot\_grammar.json**

{  
 "global\_rules": \[  
   "Every scene must open with spatial orientation or controlled disorientation by rule.",  
   "Every confrontation scene must include at least 1 scale-establishing frame and 1 state-revealing frame.",  
   "Every Mikage hero frame must preserve porcelain mask readability unless concealment is narratively justified.",  
   "Damage is shown through material consequence, not abstract VFX excess.",  
   "Crimson emission can accent state but cannot replace material damage evidence."  
 \],

 "scene\_type\_bindings": {  
   "confrontation": \[  
     "establishing",  
     "medium\_tension",  
     "close\_emotional",  
     "low\_angle\_heroic",  
     "reaction",  
     "aftermath\_hold"  
   \],  
   "revelation": \[  
     "insert\_detail",  
     "close\_emotional",  
     "reaction",  
     "negative\_space\_isolation"  
   \],  
   "combat": \[  
     "wide\_monumental",  
     "tracking",  
     "impact",  
     "reaction",  
     "aftermath\_hold"  
   \],  
   "aftermath": \[  
     "wide\_monumental",  
     "close\_emotional",  
     "insert\_detail",  
     "aftermath\_hold"  
   \]  
 }  
}  
---

# **6\. CINEMATIC STATE MAPPING**

## **6.1 Vai trò**

Cinematic state mapping là lớp cực quan trọng.  
 Nó biến **runtime truth** từ Character State Tracker thành **visual truth có kiểm soát**.

Không có lớp này thì hình sẽ đẹp nhưng sai continuity.

## **6.2 cinematic\_state\_map.schema.json**

{  
 "$id": "cinematic\_state\_map.schema.json",  
 "type": "object",  
 "required": \[  
   "mapping\_id",  
   "character\_id",  
   "state\_snapshot\_id",  
   "visual\_surface\_state",  
   "body\_mechanics\_state",  
   "face\_mask\_readability",  
   "armor\_condition",  
   "reactor\_signal\_state",  
   "gesture\_language",  
   "blocking\_tendency",  
   "combat\_readiness\_signal",  
   "psychological\_signal",  
   "loyalty\_signal",  
   "knowledge\_signal",  
   "visibility\_control"  
 \],  
 "properties": {  
   "mapping\_id": { "type": "string" },  
   "character\_id": { "type": "string" },  
   "state\_snapshot\_id": { "type": "string" },

   "visual\_surface\_state": {  
     "type": "string",  
     "enum": \[  
       "immaculate",  
       "weathered",  
       "fractured",  
       "severely\_damaged",  
       "field\_repaired"  
     \]  
   },

   "body\_mechanics\_state": {  
     "type": "string",  
     "enum": \[  
       "stable",  
       "guarded",  
       "strained",  
       "compromised",  
       "near\_failure"  
     \]  
   },

   "face\_mask\_readability": {  
     "type": "string",  
     "enum": \[  
       "full\_readable",  
       "partial\_occluded",  
       "silhouette\_only",  
       "concealed\_for\_reveal"  
     \]  
   },

   "armor\_condition": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "reactor\_signal\_state": {  
     "type": "string",  
     "enum": \[  
       "none",  
       "internal\_hint",  
       "controlled\_leak",  
       "visible\_damage\_leak",  
       "critical\_instability"  
     \]  
   },

   "gesture\_language": {  
     "type": "string",  
     "enum": \[  
       "minimal\_control",  
       "predatory\_stillness",  
       "measured\_guard",  
       "fatigued\_resistance",  
       "fractured\_resolve"  
     \]  
   },

   "blocking\_tendency": {  
     "type": "string",  
     "enum": \[  
       "holds\_center",  
       "holds\_edge",  
       "withdraws",  
       "advances\_without\_commitment",  
       "collapses\_after\_action"  
     \]  
   },

   "combat\_readiness\_signal": {  
     "type": "string",  
     "enum": \[  
       "combat\_ready",  
       "combat\_capable\_but\_limited",  
       "defensive\_only",  
       "degraded\_capacity",  
       "critical\_capacity\_loss"  
     \]  
   },

   "psychological\_signal": {  
     "type": "string",  
     "enum": \[  
       "cold\_control",  
       "contained\_grief",  
       "suppressed\_fury",  
       "identity\_instability",  
       "selfhood\_assertion"  
     \]  
   },

   "loyalty\_signal": {  
     "type": "string",  
     "enum": \[  
       "aligned",  
       "conditional\_alignment",  
       "fractured\_alignment",  
       "private\_divergence",  
       "open\_disavowal"  
     \]  
   },

   "knowledge\_signal": {  
     "type": "string",  
     "enum": \[  
       "fully\_informed",  
       "partial\_model",  
       "active\_doubt",  
       "misled",  
       "truth\_approaching"  
     \]  
   },

   "visibility\_control": {  
     "type": "object",  
     "required": \[  
       "show\_injury",  
       "show\_system\_damage",  
       "show\_emotional\_break",  
       "show\_alignment\_instability",  
       "show\_knowledge\_gap"  
     \],  
     "properties": {  
       "show\_injury": { "type": "boolean" },  
       "show\_system\_damage": { "type": "boolean" },  
       "show\_emotional\_break": { "type": "boolean" },  
       "show\_alignment\_instability": { "type": "boolean" },  
       "show\_knowledge\_gap": { "type": "boolean" }  
     }  
   }  
 }  
}  
---

## **6.3 state\_to\_visual.mapping.json**

{  
 "physical\_state\_rules": \[  
   {  
     "if": "injury\_severity \>= 70",  
     "then": {  
       "body\_mechanics\_state": "compromised",  
       "blocking\_tendency": "holds\_edge",  
       "gesture\_language": "fatigued\_resistance",  
       "mandatory\_visual\_signals": \[  
         "asymmetric stance",  
         "restricted shoulder rotation",  
         "visible armor stress",  
         "reduced combat fluidity"  
       \]  
     }  
   }  
 \],

 "reactor\_state\_rules": \[  
   {  
     "if": "reactor\_integrity \<= 40",  
     "then": {  
       "reactor\_signal\_state": "visible\_damage\_leak",  
       "mandatory\_visual\_signals": \[  
         "restrained crimson under fracture lines",  
         "internal conduit leakage logic",  
         "no supernatural aura"  
       \]  
     }  
   }  
 \],

 "psychological\_state\_rules": \[  
   {  
     "if": "selfhood\_priority \>= 80 AND loyalty\_stability \<= 40",  
     "then": {  
       "psychological\_signal": "selfhood\_assertion",  
       "loyalty\_signal": "fractured\_alignment",  
       "blocking\_tendency": "advances\_without\_commitment",  
       "visual\_behavior": \[  
         "controlled refusal posture",  
         "distance maintenance",  
         "minimal wasted motion"  
       \]  
     }  
   }  
 \]  
}  
---

# **7\. VISUAL INTENT SCHEMA**

## **7.1 visual\_intent.schema.json**

{  
 "$id": "visual\_intent.schema.json",  
 "type": "object",  
 "required": \[  
   "primary\_subject",  
   "secondary\_subjects",  
   "dominant\_emphasis",  
   "mood\_profile",  
   "scale\_intent",  
   "beauty\_cruelty\_balance",  
   "information\_strategy"  
 \],  
 "properties": {  
   "primary\_subject": { "type": "string" },  
   "secondary\_subjects": {  
     "type": "array",  
     "items": { "type": "string" }  
   },  
   "dominant\_emphasis": {  
     "type": "string",  
     "enum": \[  
       "character",  
       "damage",  
       "world\_scale",  
       "tension",  
       "identity",  
       "aftermath",  
       "motion"  
     \]  
   },  
   "mood\_profile": {  
     "type": "array",  
     "items": {  
       "type": "string",  
       "enum": \[  
         "cold",  
         "sacred",  
         "brutal",  
         "forensic",  
         "melancholic",  
         "threatened",  
         "monumental",  
         "claustrophobic"  
       \]  
     }  
   },  
   "scale\_intent": {  
     "type": "string",  
     "enum": \[  
       "intimate",  
       "contained",  
       "architectural",  
       "civilizational"  
     \]  
   },  
   "beauty\_cruelty\_balance": {  
     "type": "string",  
     "enum": \[  
       "beauty\_dominant\_but\_wounded",  
       "balanced\_tension",  
       "cruelty\_exposed\_through\_form"  
     \]  
   },  
   "information\_strategy": {  
     "type": "string",  
     "enum": \[  
       "frontload\_clarity",  
       "staggered\_reveal",  
       "conceal\_then\_rupture",  
       "state\_first\_world\_second",  
       "world\_first\_state\_second"  
     \]  
   }  
 }  
}  
---

# **8\. LOCATION CINEMATIC GRAMMAR**

## **8.1 Vai trò**

Một location trong World Bible chưa đủ để render.  
 Cần thêm lớp **cinematic affordance**:

* vị trí camera hợp lệ

* không gian cho silhouette

* loại ánh sáng công nghiệp

* hướng gió / mưa / hơi nước

* khả năng đọc scale

## **8.2 location\_cinematic\_grammar.json**

{  
 "location\_profiles": \[  
   {  
     "location\_type": "brutalist\_rooftop\_maintenance\_platform",  
     "allowed\_camera\_profiles": \[  
       "anamorphic\_wide",  
       "ground\_skimming",  
       "low\_angle",  
       "high\_angle"  
     \],  
     "dominant\_composition": \[  
       "negative\_space\_isolation",  
       "central\_monument",  
       "layered\_depth"  
     \],  
     "environmental\_motion": \[  
       "crosswind",  
       "rain\_sheeting",  
       "steam\_vents",  
       "signal\_beacon\_flicker"  
     \],  
     "lighting\_behavior": \[  
       "backlit\_rain",  
       "industrial\_toplight",  
       "distant\_sodium\_falloff"  
     \],  
     "world\_scale\_support": true,  
     "close\_up\_support": true,  
     "forbidden\_elements": \[  
       "neon\_market\_density",  
       "fantasy\_ruins",  
       "clean\_utopian skyline",  
       "colorful hologram clutter"  
     \]  
   }  
 \]  
}  
---

# **9\. PROMPT PACK COMPILER**

## **9.1 Vai trò**

Prompt pack compiler không viết prompt theo kiểu văn xuôi ngẫu hứng.  
 Nó assemble prompt từ các lớp canonical block.

## **9.2 prompt\_pack.schema.json**

{  
 "$id": "prompt\_pack.schema.json",  
 "type": "object",  
 "required": \[  
   "prompt\_pack\_id",  
   "scene\_id",  
   "shot\_sequence\_id",  
   "modality",  
   "render\_objective",  
   "core\_prompt",  
   "negative\_prompt",  
   "style\_lock\_blocks",  
   "state\_lock\_blocks",  
   "environment\_lock\_blocks",  
   "camera\_blocks",  
   "continuity\_refs",  
   "lineage\_metadata",  
   "validator\_status"  
 \],  
 "properties": {  
   "prompt\_pack\_id": { "type": "string" },  
   "scene\_id": { "type": "string" },  
   "shot\_sequence\_id": { "type": "string" },

   "modality": {  
     "type": "string",  
     "enum": \["image\_single", "image\_series", "video\_shot", "trailer\_sequence"\]  
   },

   "render\_objective": {  
     "type": "string",  
     "enum": \[  
       "hero\_frame",  
       "story\_frame",  
       "state\_frame",  
       "world\_establishing",  
       "combat\_frame",  
       "trailer\_pack"  
     \]  
   },

   "core\_prompt": { "type": "string" },  
   "negative\_prompt": { "type": "string" },

   "style\_lock\_blocks": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "state\_lock\_blocks": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "environment\_lock\_blocks": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "camera\_blocks": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "continuity\_refs": {  
     "type": "array",  
     "items": { "type": "string" }  
   },

   "lineage\_metadata": {  
     "type": "object"  
   },

   "validator\_status": {  
     "type": "string",  
     "enum": \["draft", "passed", "blocked"\]  
   }  
 }  
}  
---

## **9.3 prompt assembly order**

{  
 "assembly\_order": \[  
   "render\_objective",  
   "scene\_function",  
   "primary\_subject\_lock",  
   "character\_visual\_dna\_lock",  
   "runtime\_state\_lock",  
   "location\_cinematic\_lock",  
   "era\_lock",  
   "environmental\_conditions",  
   "camera\_and\_lens",  
   "lighting\_logic",  
   "composition\_logic",  
   "material\_truth\_logic",  
   "forbidden\_drift\_exclusion"  
 \]  
}  
---

## **9.4 cinematic\_prompt\_compiler.spec.json**

{  
 "compiler\_rules": \[  
   "Prompt must always begin with render objective \+ scene identity.",  
   "Character truth block must precede style adjectives.",  
   "Runtime damage block must be inserted before mood styling.",  
   "Environment block must state hard sci-fi industrial logic explicitly.",  
   "Crimson signal must be framed as reactor/system damage leakage, never mystical energy.",  
   "Negative prompt must include anime drift, fantasy drift, neon overload, glamour drift where relevant."  
 \],

 "modality\_profiles": {  
   "image\_single": {  
     "max\_primary\_focus": 1,  
     "detail\_density": "high",  
     "continuity\_strictness": "high"  
   },  
   "image\_series": {  
     "max\_shots": 8,  
     "shot\_variation": "controlled",  
     "continuity\_strictness": "high"  
   },  
   "video\_shot": {  
     "movement\_required": true,  
     "temporal\_readability": "high"  
   },  
   "trailer\_sequence": {  
     "requires\_rhythm\_profile": true,  
     "requires\_escalation\_curve": true,  
     "requires\_anchor\_frames": true  
   }  
 }  
}  
---

# **10\. TRAILER CONVERSION LOGIC**

## **10.1 Vai trò**

Trailer logic chuyển scene set thành trailer plan có escalation rõ ràng.  
 Không phải cắt clip ngẫu nhiên.  
 Nó phải giữ:

* canon truth

* reveal discipline

* emotional escalation

* world scale

* identity lock

## **10.2 trailer\_plan.schema.json**

{  
 "$id": "trailer\_plan.schema.json",  
 "type": "object",  
 "required": \[  
   "trailer\_id",  
   "objective",  
   "source\_scene\_ids",  
   "duration\_profile",  
   "structure\_profile",  
   "beat\_plan",  
   "reveal\_strategy",  
   "anchor\_images",  
   "text\_card\_logic",  
   "audio\_direction",  
   "validator\_status"  
 \],  
 "properties": {  
   "trailer\_id": { "type": "string" },  
   "objective": {  
     "type": "string",  
     "enum": \[  
       "teaser",  
       "character\_trailer",  
       "world\_trailer",  
       "conflict\_trailer",  
       "launch\_trailer"  
     \]  
   },  
   "source\_scene\_ids": {  
     "type": "array",  
     "items": { "type": "string" }  
   },  
   "duration\_profile": {  
     "type": "string",  
     "enum": \[  
       "15s",  
       "30s",  
       "45s",  
       "60s",  
       "90s"  
     \]  
   },  
   "structure\_profile": {  
     "type": "string",  
     "enum": \[  
       "mystery\_escalation",  
       "pressure\_collapse",  
       "identity\_conflict",  
       "world\_then\_character",  
       "character\_then\_world"  
     \]  
   },  
   "beat\_plan": {  
     "type": "array",  
     "items": { "$ref": "trailer\_beat.schema.json" }  
   },  
   "reveal\_strategy": {  
     "type": "string",  
     "enum": \[  
       "conceal\_identity\_then\_reveal\_damage",  
       "reveal\_world\_then\_mask",  
       "state\_fragments\_only",  
       "controlled\_character\_exposure"  
     \]  
   },  
   "anchor\_images": {  
     "type": "array",  
     "items": { "type": "string" }  
   },  
   "text\_card\_logic": {  
     "type": "array",  
     "items": { "type": "string" }  
   },  
   "audio\_direction": {  
     "type": "array",  
     "items": { "type": "string" }  
   },  
   "validator\_status": {  
     "type": "string",  
     "enum": \["draft", "passed", "blocked"\]  
   }  
 }  
}  
---

## **10.3 trailer\_beat.schema.json**

{  
 "$id": "trailer\_beat.schema.json",  
 "type": "object",  
 "required": \[  
   "beat\_order",  
   "beat\_role",  
   "source\_scene\_id",  
   "source\_shot\_ids",  
   "duration\_seconds",  
   "intensity\_level",  
   "reveal\_payload",  
   "transition\_type"  
 \],  
 "properties": {  
   "beat\_order": { "type": "integer" },  
   "beat\_role": {  
     "type": "string",  
     "enum": \[  
       "cold\_open",  
       "world\_establish",  
       "character\_glimpse",  
       "pressure\_rise",  
       "damage\_reveal",  
       "conflict\_peak",  
       "identity\_line",  
       "aftershock",  
       "title\_resolve"  
     \]  
   },  
   "source\_scene\_id": { "type": "string" },  
   "source\_shot\_ids": {  
     "type": "array",  
     "items": { "type": "string" }  
   },  
   "duration\_seconds": { "type": "number" },  
   "intensity\_level": { "type": "integer", "minimum": 1, "maximum": 10 },  
   "reveal\_payload": {  
     "type": "array",  
     "items": {  
       "type": "string",  
       "enum": \[  
         "world\_scale",  
         "mask\_identity",  
         "armor\_damage",  
         "reactor\_instability",  
         "betrayal\_hint",  
         "loyalty\_fracture",  
         "selfhood\_assertion",  
         "threat\_presence"  
       \]  
     }  
   },  
   "transition\_type": {  
     "type": "string",  
     "enum": \[  
       "hard\_cut",  
       "impact\_cut",  
       "audio\_carry",  
       "silence\_break",  
       "match\_motion",  
       "black\_frame\_pulse"  
     \]  
   }  
 }  
}  
---

## **10.4 trailer\_conversion\_logic.json**

{  
 "global\_rules": \[  
   "Trailer cannot reveal full betrayal chain unless objective explicitly allows it.",  
   "Trailer must include at least 1 world-scale beat and 1 state-truth beat.",  
   "Mikage character trailer must include mask readability, armor damage truth, and selfhood pressure.",  
   "No trailer may imply fantasy ontology.",  
   "Escalation must be emotional \+ material, not only visual noise."  
 \],

 "duration\_profiles": {  
   "30s": {  
     "target\_beats": 6,  
     "recommended\_structure": \[  
       "cold\_open",  
       "world\_establish",  
       "character\_glimpse",  
       "pressure\_rise",  
       "damage\_reveal",  
       "title\_resolve"  
     \]  
   },  
   "60s": {  
     "target\_beats": 9,  
     "recommended\_structure": \[  
       "cold\_open",  
       "world\_establish",  
       "character\_glimpse",  
       "pressure\_rise",  
       "identity\_line",  
       "conflict\_peak",  
       "aftershock",  
       "damage\_reveal",  
       "title\_resolve"  
     \]  
   }  
 }  
}  
---

# **11\. VALIDATOR RULES**

## **11.1 cinematic\_validator.layers.json**

{  
 "layers": \[  
   "narrative\_continuity",  
   "state\_continuity",  
   "visual\_dna\_compliance",  
   "ontology\_compliance",  
   "location\_era\_compliance",  
   "shot\_grammar\_compliance",  
   "prompt\_integrity",  
   "trailer\_reveal\_control"  
 \]  
}

## **11.2 cinematic\_validator.severity.json**

{  
 "severity\_levels": \[  
   "info",  
   "warning",  
   "major",  
   "critical",  
   "blocker"  
 \]  
}

## **11.3 cinematic\_validator.rulepack.json**

{  
 "rules": \[  
   {  
     "rule\_id": "CAL-001",  
     "name": "scene\_must\_bind\_to\_timeline\_anchor",  
     "layer": "narrative\_continuity",  
     "severity": "blocker"  
   },  
   {  
     "rule\_id": "CAL-002",  
     "name": "character\_state\_ref\_required\_for\_all\_primary\_characters",  
     "layer": "state\_continuity",  
     "severity": "blocker"  
   },  
   {  
     "rule\_id": "CAL-003",  
     "name": "mikage\_mask\_must\_remain\_canon\_readable\_unless\_explicit\_concealment\_flag",  
     "layer": "visual\_dna\_compliance",  
     "severity": "critical"  
   },  
   {  
     "rule\_id": "CAL-004",  
     "name": "crimson\_emission\_requires\_material\_damage\_source",  
     "layer": "ontology\_compliance",  
     "severity": "blocker"  
   },  
   {  
     "rule\_id": "CAL-005",  
     "name": "location\_visuals\_must\_match\_location\_cinematic\_profile",  
     "layer": "location\_era\_compliance",  
     "severity": "critical"  
   },  
   {  
     "rule\_id": "CAL-006",  
     "name": "every\_confrontation\_scene\_requires\_scale\_frame\_and\_state\_frame",  
     "layer": "shot\_grammar\_compliance",  
     "severity": "major"  
   },  
   {  
     "rule\_id": "CAL-007",  
     "name": "prompt\_pack\_must\_include\_negative\_profile",  
     "layer": "prompt\_integrity",  
     "severity": "major"  
   },  
   {  
     "rule\_id": "CAL-008",  
     "name": "trailer\_must\_not\_overreveal\_core\_twist",  
     "layer": "trailer\_reveal\_control",  
     "severity": "blocker"  
   },  
   {  
     "rule\_id": "CAL-009",  
     "name": "anime\_or\_pastel\_or\_glamour\_drift\_forbidden",  
     "layer": "visual\_dna\_compliance",  
     "severity": "blocker"  
   },  
   {  
     "rule\_id": "CAL-010",  
     "name": "industrial\_hard\_scifi\_world\_logic\_mandatory",  
     "layer": "ontology\_compliance",  
     "severity": "blocker"  
   }  
 \]  
}  
---

# **12\. ADAPTATION REPORT**

## **12.1 adaptation\_report.schema.json**

{  
 "$id": "adaptation\_report.schema.json",  
 "type": "object",  
 "required": \[  
   "report\_id",  
   "scene\_id",  
   "shot\_sequence\_id",  
   "prompt\_pack\_id",  
   "validation\_result",  
   "drift\_risk",  
   "continuity\_risk",  
   "reveal\_risk",  
   "notes"  
 \],  
 "properties": {  
   "report\_id": { "type": "string" },  
   "scene\_id": { "type": "string" },  
   "shot\_sequence\_id": { "type": "string" },  
   "prompt\_pack\_id": { "type": "string" },  
   "validation\_result": {  
     "type": "string",  
     "enum": \["passed", "warning", "blocked"\]  
   },  
   "drift\_risk": { "type": "integer", "minimum": 0, "maximum": 100 },  
   "continuity\_risk": { "type": "integer", "minimum": 0, "maximum": 100 },  
   "reveal\_risk": { "type": "integer", "minimum": 0, "maximum": 100 },  
   "notes": {  
     "type": "array",  
     "items": { "type": "string" }  
   }  
 }  
}  
---

# **13\. SEED EXAMPLE — MIKAGE ROOFTOP SCENE**

## **13.1 scene\_templates.seed.json**

\[  
 {  
   "scene\_id": "scene\_mikage\_rooftop\_001",  
   "source\_story\_arc\_id": "arc\_leia",  
   "source\_sequence\_id": "seq\_leia\_04",  
   "timeline\_anchor\_id": "anchor\_leia\_041",  
   "scene\_type": "confrontation",  
   "canonical\_purpose": "Show Mikage at the threshold between obedience and selfhood.",  
   "dramatic\_function": "test\_identity",  
   "location\_id": "loc\_rooftop\_maintenance\_platform\_12",  
   "era\_id": "era\_late\_entropy\_industrial\_age",  
   "time\_of\_day": "night",  
   "environment\_conditions": \[  
     "violent\_rain",  
     "crosswind",  
     "industrial\_haze",  
     "distant\_beacons"  
   \],  
   "participating\_characters": \[  
     "char\_mikage",  
     "char\_shirogane"  
   \],  
   "character\_state\_refs": \[  
     "state\_mikage\_anchor\_leia\_041",  
     "state\_shirogane\_anchor\_leia\_041"  
   \],  
   "conflict\_axis": \[  
     "memory\_vs\_identity",  
     "order\_vs\_freedom",  
     "body\_vs\_self"  
   \],  
   "visual\_intent": {  
     "primary\_subject": "char\_mikage",  
     "secondary\_subjects": \["loc\_rooftop\_maintenance\_platform\_12"\],  
     "dominant\_emphasis": "identity",  
     "mood\_profile": \["cold", "monumental", "threatened"\],  
     "scale\_intent": "civilizational",  
     "beauty\_cruelty\_balance": "beauty\_dominant\_but\_wounded",  
     "information\_strategy": "state\_first\_world\_second"  
   },  
   "state\_pressure": {  
     "physical\_pressure": 78,  
     "psychological\_pressure": 84,  
     "systemic\_pressure": 71,  
     "social\_pressure": 69  
   },  
   "scene\_beats": \[  
     {  
       "beat\_id": "beat\_001",  
       "beat\_order": 1,  
       "beat\_type": "arrival",  
       "narrative\_action": "Mikage holds the rooftop edge instead of advancing.",  
       "visible\_action": "Stillness against storm and city abyss.",  
       "state\_delta": \[\],  
       "shot\_intent": "establish",  
       "reveal\_level": "partial"  
     },  
     {  
       "beat\_id": "beat\_002",  
       "beat\_order": 2,  
       "beat\_type": "micro\_reaction",  
       "narrative\_action": "Internal fracture surfaces through controlled posture.",  
       "visible\_action": "Armor stress and reactor leakage hinted.",  
       "state\_delta": \["selfhood\_assertion\_up"\],  
       "shot\_intent": "reveal",  
       "reveal\_level": "controlled"  
     }  
   \],  
   "cinematic\_priority": "character\_revelation",  
   "continuity\_inputs": \[  
     "mikage\_reactor\_damage\_existing",  
     "loyalty\_fracture\_existing",  
     "knowledge\_gap\_betrayal\_chain\_active"  
   \],  
   "continuity\_outputs": \[  
     "alignment\_instability\_visible",  
     "combat\_readiness\_visibly\_degraded"  
   \],  
   "canon\_constraints": \[  
     "no\_magic\_visualization",  
     "mask\_must\_remain\_canonical",  
     "damage\_must\_be\_material"  
   \],  
   "adaptation\_status": "validated"  
 }  
\]  
---

## **13.2 mikage\_visual\_state\_profiles.seed.json**

\[  
 {  
   "mapping\_id": "map\_mikage\_anchor\_leia\_041",  
   "character\_id": "char\_mikage",  
   "state\_snapshot\_id": "state\_mikage\_anchor\_leia\_041",  
   "visual\_surface\_state": "fractured",  
   "body\_mechanics\_state": "compromised",  
   "face\_mask\_readability": "full\_readable",  
   "armor\_condition": \[  
     "white\_porcelain\_fractures",  
     "matte\_black\_carbon\_reinforcement\_exposed",  
     "dark\_titanium\_joint\_stress"  
   \],  
   "reactor\_signal\_state": "visible\_damage\_leak",  
   "gesture\_language": "fractured\_resolve",  
   "blocking\_tendency": "holds\_edge",  
   "combat\_readiness\_signal": "combat\_capable\_but\_limited",  
   "psychological\_signal": "selfhood\_assertion",  
   "loyalty\_signal": "fractured\_alignment",  
   "knowledge\_signal": "active\_doubt",  
   "visibility\_control": {  
     "show\_injury": true,  
     "show\_system\_damage": true,  
     "show\_emotional\_break": false,  
     "show\_alignment\_instability": true,  
     "show\_knowledge\_gap": true  
   }  
 }  
\]  
---

# **14\. SHOT SEQUENCE EXAMPLE**

## **14.1 shot\_templates.seed.json**

\[  
 {  
   "shot\_id": "shot\_rooftop\_001",  
   "scene\_id": "scene\_mikage\_rooftop\_001",  
   "shot\_order": 1,  
   "shot\_type": "wide\_monumental",  
   "camera\_distance": "extreme\_wide",  
   "camera\_angle": "low\_angle",  
   "lens\_profile": "anamorphic\_wide",  
   "composition\_profile": "negative\_space\_isolation",  
   "subject\_focus": \["char\_mikage", "megacity\_scale"\],  
   "blocking": "elevated\_edge\_position",  
   "motion\_profile": "slow\_push",  
   "lighting\_profile": "backlit\_rain",  
   "state\_visibility": {  
     "injury\_visibility": "hinted",  
     "emotion\_visibility": "contained",  
     "system\_damage\_visibility": "hinted",  
     "loyalty\_visibility": "inferred",  
     "knowledge\_visibility": "concealed"  
   },  
   "environment\_visibility": "scale\_dominant",  
   "canon\_flags": \[  
     "porcelain\_mask\_readable",  
     "industrial\_scale\_required"  
   \],  
   "prompt\_role": "hero\_frame"  
 },  
 {  
   "shot\_id": "shot\_rooftop\_002",  
   "scene\_id": "scene\_mikage\_rooftop\_001",  
   "shot\_order": 2,  
   "shot\_type": "close\_emotional",  
   "camera\_distance": "medium\_close",  
   "camera\_angle": "eye\_level",  
   "lens\_profile": "anamorphic\_standard",  
   "composition\_profile": "symmetry\_broken\_by\_damage",  
   "subject\_focus": \["mask", "armor\_fracture", "reactor\_leak"\],  
   "blocking": "still\_dominant",  
   "motion\_profile": "locked\_frame",  
   "lighting\_profile": "reactor\_leak\_accent",  
   "state\_visibility": {  
     "injury\_visibility": "visible",  
     "emotion\_visibility": "contained",  
     "system\_damage\_visibility": "visible",  
     "loyalty\_visibility": "implied",  
     "knowledge\_visibility": "partial"  
   },  
   "environment\_visibility": "supportive",  
   "canon\_flags": \[  
     "material\_damage\_truth",  
     "no\_supernatural\_glow"  
   \],  
   "prompt\_role": "state\_frame"  
 }  
\]  
---

# **15\. PROMPT PACK EXAMPLE**

## **15.1 prompt\_pack\_mikage\_rooftop.json**

{  
 "prompt\_pack\_id": "pp\_mikage\_rooftop\_001",  
 "scene\_id": "scene\_mikage\_rooftop\_001",  
 "shot\_sequence\_id": "seq\_shots\_rooftop\_001",  
 "modality": "image\_single",  
 "render\_objective": "hero\_frame",  
 "core\_prompt": "A monumental cinematic hard sci-fi frame of Mikage holding the edge of a brutalist rooftop maintenance platform above a vast industrial megacity at night during violent rain and crosswind. She wears the canonical seamless glossy white porcelain Kitsune mask, perfectly symmetrical and cold, with long black hair driven by storm wind. Her armor is fractured white porcelain over matte black carbon fiber and dark titanium joints, with restrained crimson reactor leakage visible only beneath ceramic cracks as material system damage. The composition uses low-angle anamorphic wide framing, extreme chiaroscuro, negative space isolation, backlit rain, industrial haze, distant beacons, and civilizational scale. The world reads as hard sci-fi entropy industrial civilization, never fantasy, never neon spectacle.",  
 "negative\_prompt": "anime idol, soft pastel glamour, fantasy magic, colorful cyberpunk overload, neon club city, supernatural aura, glossy fashion editorial, cute face stylization, magical energy effects, ornamental fantasy armor",  
 "style\_lock\_blocks": \[  
   "porcelain purity",  
   "void black contrast",  
   "visceral crimson accent",  
   "restrained futurism",  
   "industrial brutality",  
   "sacred fracture aesthetics"  
 \],  
 "state\_lock\_blocks": \[  
   "fractured armor condition",  
   "compromised but standing body mechanics",  
   "fractured alignment signal",  
   "selfhood pressure",  
   "reactor damage leakage"  
 \],  
 "environment\_lock\_blocks": \[  
   "brutalist rooftop maintenance platform",  
   "violent rain",  
   "crosswind",  
   "industrial megacity haze",  
   "sparse sodium and beacon lighting"  
 \],  
 "camera\_blocks": \[  
   "low angle",  
   "anamorphic wide",  
   "negative space isolation",  
   "monumental scale",  
   "hard chiaroscuro"  
 \],  
 "continuity\_refs": \[  
   "anchor\_leia\_041",  
   "state\_mikage\_anchor\_leia\_041",  
   "visual\_dna\_mikage\_core"  
 \],  
 "lineage\_metadata": {  
   "character\_id": "char\_mikage",  
   "location\_id": "loc\_rooftop\_maintenance\_platform\_12",  
   "era\_id": "era\_late\_entropy\_industrial\_age"  
 },  
 "validator\_status": "passed"  
}  
---

# **16\. TRAILER PRESET SEED**

## **16.1 trailer\_presets.seed.json**

\[  
 {  
   "preset\_id": "trailer\_mikage\_character\_30s",  
   "objective": "character\_trailer",  
   "duration\_profile": "30s",  
   "structure\_profile": "identity\_conflict",  
   "required\_beats": \[  
     "cold\_open",  
     "world\_establish",  
     "character\_glimpse",  
     "pressure\_rise",  
     "damage\_reveal",  
     "title\_resolve"  
   \],  
   "reveal\_strategy": "conceal\_identity\_then\_reveal\_damage",  
   "must\_include": \[  
     "mask\_identity",  
     "world\_scale",  
     "armor\_damage",  
     "selfhood\_assertion"  
   \],  
   "forbidden\_reveals": \[  
     "full\_betrayal\_chain",  
     "final\_alignment\_resolution",  
     "major\_lore\_exposition\_dump"  
   \]  
 }  
\]  
---

# **17\. OPERATIONAL RULES**

## **17.1 Narrative → Scene rules**

* mỗi narrative sequence phải map thành 1 hoặc nhiều scene

* scene phải gắn vào `timeline_anchor_id`

* scene phải có `dramatic_function`

* scene phải xác định cái gì được lộ và cái gì bị giữ lại

## **17.2 Scene → Shot rules**

* mỗi scene phải có tối thiểu:

  * 1 shot định hướng không gian hoặc có chủ đích gây mất định hướng

  * 1 shot thể hiện state truth

  * 1 shot xác nhận location/era

* confrontation scene phải có:

  * 1 scale shot

  * 1 state shot

  * 1 tension shot

## **17.3 State → Visual rules**

* injury nặng phải có hậu quả trên posture/material

* loyalty fracture không được chỉ nói bằng text; phải gợi qua blocking/distance/framing

* knowledge gap phải ảnh hưởng reveal strategy

* reactor damage phải luôn có logic vật chất đi kèm

## **17.4 Prompt compilation rules**

* prompt không được bắt đầu bằng moodboard language thuần túy

* prompt phải ưu tiên ontology \+ subject truth \+ state truth

* negative prompt là bắt buộc

* visual DNA blocks luôn được cắm cố định

## **17.5 Trailer rules**

* không overexplain

* không leak twist lõi

* escalation phải đi theo: **world → pressure → fracture → identity**

* phải có ít nhất 1 anchor frame đủ mạnh để thành key art

---

# **18\. FAILURE MODES BỊ CHẶN**

Hệ validator phải block nếu gặp:

1. **Narrative/visual mismatch**  
    truyện nói Mikage đang suy yếu nhưng hình lại full sức mạnh vô cớ

2. **Ontology drift**  
    reactor leak trông như phép thuật

3. **Visual DNA drift**  
    neon cyberpunk quá mức, anime, pastel, glamour fashion

4. **Location drift**  
    rooftop brutalist thành city fantasy / rooftop sạch bóng phi lý

5. **State concealment failure**  
    continuity yêu cầu lộ armor fracture nhưng shot lại che hoàn toàn

6. **Trailer overreveal**  
    lộ bí mật plot quá sớm

7. **Scale failure**  
    scene cần world-scale mà frame lại thành portrait chung chung

---

# **19\. KẾT NỐI VỚI CÁC KHỐI KHÁC**

## **Input dependencies**

* **World Bible Database**

  * location canon

  * era canon

  * event truth

  * rule truth

  * visual DNA profile

* **Character State Tracker**

  * injury

  * loyalty

  * knowledge

  * psyche

  * system integrity

  * mission deviation

* **Narrative Engine**

  * story objective

  * sequence beats

  * reveal order

  * continuity outputs

* **Prompt Compiler System**

  * objective registry

  * negative profiles

  * preset/variant framework

## **Output consumers**

* **Generation Orchestrator**

  * receives prompt packs, shot sequences, trailer plans

* **Ingestion Pipeline**

  * receives lineage metadata and adaptation report

* **Benchmark System**

  * compares output against gold/silver/red sets

* **Studio Control Interface**

  * reviews scene graph, shot plan, prompt pack, trailer plan, validation report

---

# **20\. MVP IMPLEMENTATION ORDER**

Triển khai đúng thứ tự này:

### **Phase 1 — Core schemas**

* `scene.schema.json`

* `shot.schema.json`

* `cinematic_state_map.schema.json`

* `prompt_pack.schema.json`

* `trailer_plan.schema.json`

### **Phase 2 — Grammar \+ mappings**

* `shot_grammar.json`

* `location_cinematic_grammar.json`

* `state_to_visual.mapping.json`

* `narrative_to_scene.mapping.json`

### **Phase 3 — Compiler**

* `cinematic_prompt_compiler.spec.json`

* `prompt_assembly_order.json`

* `negative_profile.cinematic.json`

### **Phase 4 — Validators**

* `cinematic_validator.rulepack.json`

* severity / layers / enums

### **Phase 5 — Seed content**

* rooftop confrontation seed

* Mikage state visual seed

* 30s character trailer seed

### **Phase 6 — Runtime integration**

* Narrative Engine emits scene intents

* State Tracker injects state refs

* Compiler emits prompt packs

* Orchestrator launches jobs

* Ingestion writes adaptation reports

