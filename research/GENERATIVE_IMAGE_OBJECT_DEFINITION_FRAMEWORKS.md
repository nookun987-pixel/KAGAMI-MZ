# **Deterministic Object Modeling and Identity Stability in Generative Diffusion Architectures**

The transition of generative image systems from stochastic, prompt-based synthesis to deterministic, object-oriented engineering represents a fundamental shift in the landscape of computer vision and digital asset production. For professional deployment, the reliance on high-level linguistic descriptions—often characterized as "prompting"—is increasingly viewed as a primary source of systemic instability. In its place, frameworks for defining objects before the initiation of the diffusion process have emerged. These frameworks aim to establish a "ground truth" for identity, structure, and material properties, thereby ensuring readability, identity stability, and the prevention of abstract drift.1 Abstract drift occurs when the recursive denoising process of a diffusion model diverges from the intended semantic structure, often resulting in outputs that prioritize textural coherence over formal integrity. By implementing rigorous pre-generation definitions, production systems can anchor the latent space in a way that preserves object identity across infinite variations in lighting, pose, and environmental context.4

## **Object Definition Methods: From Linguistic Ambiguity to Structural Grounding**

The limitation of traditional text-to-image (T2I) systems lies in the "semantic bottleneck," where complex visual concepts are compressed into linear, often ambiguous, natural language tokens. To overcome this, contemporary systems utilize specialized grounding mechanisms and structured data representations that define an object's parameters prior to the first denoising step.2

### **Grounding Tokens and Semantic-Spatial Fusion**

The most influential shift in object definition is the introduction of grounding tokens. As exemplified by the GLIGEN (Grounded-Language-to-Image Generation) framework, grounding tokens decouple the "what" from the "where".2 In this architecture, an object is not merely a word in a prompt; it is a composite entity defined by a semantic feature (encoded text or a reference image) and a spatial feature (encoded bounding box or keypoints). This dual-input system allows for the creation of "spatially counterfactual" scenes—such as an elephant the size of a mouse—which standard models typically reject due to training priors.2

The implementation of grounding tokens relies on a gated self-attention mechanism inserted into the transformer blocks of a frozen pre-trained diffusion model. By freezing the base model, the system preserves existing knowledge of textures and lighting while the new trainable layers learn to map the grounding tokens to specific spatial regions within the latent representation. This ensures that the object's silhouette and position are strictly enforced before the model begins to fill in finer details.2

| Component of Grounding | Technical Representation | Role in Object Definition |
| :---- | :---- | :---- |
| **Semantic Token** | CLIP-encoded text or ViT-encoded reference image. | Defines the core identity, material, and category of the object. |
| **Spatial Token** | Bounding box coordinates ![][image1] or keypoints. | Establishes the formal boundaries and orientation of the object. |
| **Gated Mechanism** | Trainable scalar weight ![][image2] for modulated attention. | Controls the balance between grounding instructions and model priors. |
| **Scheduled Sampling** | Dynamic activation of grounding layers across time-steps. | Allows grounding to dominate early structure and priors to dominate late textures. |

### **Scene Graphs and Deterministic Metadata**

For production pipelines requiring multi-object coherence, the "scene graph" has become the standard for pre-render definition. A scene graph models the compositional space as a directed graph where nodes represent objects and edges represent relationships (e.g., "subject-verb-object" or spatial predicates like "to the left of").3 The Generate Any Scene engine demonstrates how pre-computing a library of scene-graph topologies allows for the systematic enumeration of visual content.3

This deterministic approach involves five critical stages before rendering. First, scene graph structures are enumerated based on user-specified constraints such as complexity (number of objects) and connected components. Second, these structures are populated with metadata, where each node is assigned specific attributes (e.g., "worn leather," "distressed brass"). Third, scene attributes like art style and viewpoint are sampled. Fourth, the graph is programmatically translated into a descriptive caption that tracks object references to ensure coherence (e.g., "the first robot," "the second robot"). Finally, the graph is converted into question-answer pairs for automated post-render validation.3 This ensures that the generated image can be audited against the original definition, providing a metric for "semantic alignment" that is impossible with unstructured prompts.

### **Identity Anchoring and Multi-Reference Stability**

Identity stability—the ability to maintain a recognizable character or product across different scenes—requires more than just a name. Systems like FLUX.2 and ID-Booth utilize multi-reference consistency to lock in visual traits.4 FLUX.2 supports up to ten reference images in a single generation, extracting shared latent features to create a high-fidelity "identity anchor".4

ID-Booth further refines this by introducing a triplet identity training objective. Unlike standard fine-tuning, which only looks at positive samples of an identity, the triplet loss considers both positive and negative samples (distractors).9 This pushes the model to learn the unique features that define a specific object while discarding general features common to its class. This is particularly vital for industrial applications where "brand-consistent" products must be generated without bleeding into generic versions of that product category.

## **Common Failure Patterns: The Mechanics of Abstract Drift and Texture Dominance**

Despite advanced grounding, diffusion models are prone to specific failure modes that undermine object readability. Understanding these failures requires an analysis of the internal "drift" that occurs during the recursive sampling process.10

### **Sampling Drift and Spectral Divergence**

Consistent Diffusion Models (CDMs) identify "sampling drift" as a primary failure mode.11 Diffusion models are typically trained on "clean" data contaminated by Gaussian noise. However, during inference, the model generates its own "noisy" samples. Small errors in the score matching (the model's prediction of the noise) accumulate over the 20 to 50 denoising steps. This causes the sampling iterates to "drift" away from the manifold of the training data.11

When drift occurs, the object's identity begins to erode. An intended "steampunk robot" might slowly morph into a generic "brass texture" because the model loses the high-level structural constraints that were present in the initial steps.11 This spectral divergence—where low-frequency global structures are lost to high-frequency textural noise—is a hallmark of "texture-only" generation.

### **The Coarse-to-Fine Ordering Problem**

A critical insight from the Semantic-First Diffusion (SFD) research is that diffusion models naturally follow a coarse-to-fine generation process.5 High-level semantic structures (the "skeleton" of the object) are typically established in the earliest stages of denoising, while textures (the "skin") are refined in the final stages.5

Failure occurs when the model attempts to denoise semantic and texture information synchronously. If the texture modeling begins before the semantic anchor is fully "locked," the model may hallucinate textures that do not align with any coherent shape, leading to "abstract output".5 This is often seen in failed generations of complex objects like hands or mechanical gears, where the material (skin or metal) is rendered beautifully, but the structure (fingers or teeth) is anatomically or mechanically impossible.4

### **Isotropic Noise and Structural Blurring**

Traditional diffusion models use isotropic Gaussian noise, which treats every pixel and spatial region equally. While mathematically convenient, this ignores the underlying structure of images, which is defined by edges and gradients.13 During the denoising process, isotropic noise tends to "blur" important structural boundaries. This results in "object unreadability," where the object blends into the background or loses its distinct silhouette. Edge-preserving diffusion models address this by using an anisotropic noise scheduler that suppresses noise in areas of high gradients, effectively "shielding" the object's edges during the critical early stages of formation.13

| Failure Mode | Visual Symptom | Underlying Mechanism |
| :---- | :---- | :---- |
| **Abstract Output** | Indistinct shapes, "painterly" blobs. | Failure of early-stage structural anchoring. |
| **Texture-Only Images** | Detailed surfaces without coherent forms. | Synchronous denoising of semantics and texture. |
| **Object Unreadability** | Object "melts" into environment. | Isotropic noise blurring high-gradient edges. |
| **Identity Erosion** | Character changes features between frames. | Accumulated sampling drift and lack of identity anchor. |

## **Control Techniques: Enforcing Structural and Material Grounding**

To prevent the aforementioned failures, production systems implement specific control techniques that act as "hard" constraints on the generative process. These techniques focus on part decomposition, structural alignment, and material consistency.1

### **Hierarchical Part Decomposition (Decomp Diffusion)**

One of the most effective ways to prevent abstract drift is to decompose the object into its constituent parts before generation. Decomp Diffusion is an unsupervised method that represents each component of a scene (e.g., objects, lighting, shadows) as a separate diffusion model.16 By treating an object as a collection of ![][image3] factors, the system can ensure that each part—such as the wheels of a car or the legs of a chair—maintains its own structural integrity.

The core of this technique is the information bottleneck. By constraining the latent representation of each part to be low-dimensional, the model is forced to discover independent, non-overlapping factors.16 This prevents "texture bleed" where the attributes of one part (e.g., the chrome of a wheel) might otherwise drift onto another part (e.g., the leather of a seat). In robotic applications, this part-based decomposition allows for "functional actions" to be modeled as combinations of correspondence constraints, ensuring that a generated object is not just visually coherent but functionally plausible.15

### **Structural Constraints and Cycle Consistency**

While ControlNet pioneered the use of image-level spatial conditions, ControlNet++ introduces the concept of pixel-level cycle consistency.20 In this framework, the system doesn't just "try" to follow a segmentation mask; it evaluates its own progress. By using a pre-trained reward model to extract the condition from the generated image and comparing it to the input condition, the system optimizes for a "consistency loss".20 This creates a feedback loop that forces the diffusion process to strictly adhere to the silhouette defined in the pre-generation phase.

Furthermore, the use of GPMP (Gaussian Process Motion Planning) priors in hierarchical diffusion models introduces "task-conditioned structured Gaussians".21 Instead of starting from pure random noise, the model starts from noise that already reflects the "inherent structure" of the intended output (e.g., the smooth trajectory of a mechanical arm). This "structured noise" serves as an anchor that prevents the model from ever wandering into "abstract" regions of the latent space.21

### **Material Grounding and PBR Consistency**

Readability is also a function of how light interacts with the object's surface. "Baked-in" lighting is a common failure where the model draws shadows and highlights that don't match the environment. To solve this, material grounding techniques like SuperMat and MG-DiT estimate high-quality Physically Based Rendering (PBR) materials—albedo, metallic, and roughness maps—directly within the diffusion process.22

The SuperMat framework employs a "single-step" material decomposition model that allows for millisecond-scale inference of material properties.22 By incorporating a PBR-based diffusion loss, the system ensures that the generated materials align with realistic physical principles. This is often integrated into 3D asset pipelines, where the diffusion model operates in UV space or texture space, ensuring that the object's appearance remains consistent even when viewed from different angles or under different lighting conditions.23

## **Production Pipelines: Systems for Pre-Render Enforcement**

In professional environments, object definition is not an isolated task but part of a multi-stage production pipeline. These pipelines use hardware-level orchestrators and graph-based workflows to enforce constraints.25

### **Node-Based Procedural Frameworks (ComfyUI)**

ComfyUI exemplifies the "procedural framework" approach to image generation. In this system, a workflow is a node-based graph where every operation—from checkpoint loading to latent manipulation—is a discrete program object.25 This architecture allows for "pre-render validation" where the system checks for missing node types, invalid connections, and type mismatches before a single GPU cycle is spent on inference.25

Crucially, ComfyUI supports "ephemeral nodes" and dynamic subgraphs. This means a system can define an object's high-level schema, and the pipeline will dynamically generate the necessary control nodes (e.g., ControlNets for edges, IP-Adapters for identity) to satisfy that schema. This "visual programming" environment shifts the focus from writing prompts to designing systems that "manufacture" images according to a blueprint.28

### **NVIDIA Edify: 3D-Grounded Image Synthesis**

NVIDIA Edify provides a robust example of a production system that enforces object definition through 3D grounding. The Edify 3D pipeline first synthesizes multi-view RGB and surface normal images of an object using a base diffusion model with 2.7 billion parameters.26 These multi-view observations are then used to reconstruct a 3D mesh with clean quads-based topology and 4K PBR materials.

Once the 3D asset is created, it serves as the "absolute definition" for subsequent image generation. By moving the 3D object within a virtual scene and then using "Edify Image" (conditioned on depth and sketch ControlNets) to turn the prototype into a photorealistic render, artists achieve full control over the shot.27 This prevents abstract drift by ensuring that the 2D image is always "back-projected" onto a stable, 3D geometric truth.

### **Automated Validation and Reward Modeling**

A critical component of a production pipeline is the "closed-loop" evaluation. The Generate Any Scene engine translates scene graphs into visual question-answers (VQAs).3 If the pre-generation definition specifies "a blue sphere to the left of a red cube," the system automatically asks, "What color is the sphere?" and "What is to the left of the cube?" If the AI-based VQA agent returns the wrong answer, the image is rejected or sent back for iterative refinement.3 This automated "Quality Filter" uses rejection sampling to weed out "janky" or "hallucinated" outputs before they reach the user.12

| System/Pipeline | Key Constraint Mechanism | Primary Use Case |
| :---- | :---- | :---- |
| **ComfyUI** | Node-based graph validation and caching. | Custom generative workflows, iterative design. |
| **NVIDIA Edify** | 3D mesh and PBR material reconstruction. | 3D asset generation, game design, XR. |
| **Generate Any Scene** | Scene-graph-to-VQA reward modeling. | Large-scale synthetic data generation for training. |
| **PhysicsNeMo Sym** | Physics-informed PDE and boundary constraints. | Scientific visualization, engineering simulations.30 |

## **Example Schemas: JSON Frameworks for Object Definition**

Standardizing the communication between the definition layer and the generation layer requires structured data formats. JSON Schema provides a declarative language for defining the structure and constraints of object data.32

### **Object Hierarchy and Trait Schemas**

In complex scenes, objects are often hierarchical. A "vehicle" object may contain "wheel" objects, each with its own material properties. The following JSON schema illustrates how hierarchy traits can be embedded to define parent-child relationships and constraint sets.34

JSON

{  
  "$schema": "http://json-schema.org/draft-07/schema\#",  
  "title": "HierarchicalObjectDefinition",  
  "type": "object",  
  "definitions": {  
    "material\_pbr": {  
      "type": "object",  
      "properties": {  
        "albedo": { "type": "string", "pattern": "^\#(\[A-Fa-f0-9\]{6})$" },  
        "metallic": { "type": "number", "minimum": 0, "maximum": 1 },  
        "roughness": { "type": "number", "minimum": 0, "maximum": 1 }  
      },  
      "required": \["albedo", "metallic", "roughness"\]  
    },  
    "spatial\_grounding": {  
      "type": "object",  
      "properties": {  
        "bbox": { "type": "array", "items": { "type": "number" }, "minItems": 4, "maxItems": 4 },  
        "z\_index": { "type": "integer" }  
      },  
      "required": \["bbox"\]  
    }  
  },  
  "properties": {  
    "object\_id": { "type": "string", "format": "uuid" },  
    "class\_identity": { "enum": \["robot", "vehicle", "furniture", "character"\] },  
    "grounding": { "$ref": "\#/definitions/spatial\_grounding" },  
    "surface": { "$ref": "\#/definitions/material\_pbr" },  
    "sub\_parts": {  
      "type": "array",  
      "items": {  
        "type": "object",  
        "properties": {  
          "part\_name": { "type": "string" },  
          "material\_override": { "$ref": "\#/definitions/material\_pbr" },  
          "relative\_anchor": { "type": "array", "items": { "type": "number" } }  
        }  
      }  
    }  
  },  
  "required": \["object\_id", "class\_identity", "grounding", "surface"\]  
}

### **Grammar-Based Decoding for Reliability**

To ensure that an LLM-based system produces JSON that strictly follows such a schema, "grammar-based decoding" is employed.32 Instead of just asking the model for JSON, the decoder checks the grammar rules at each step of token generation. Any token that would lead to an invalid JSON structure (e.g., a missing comma or a wrong data type) is disallowed during the decoding process. This "blueprint-based generation" guarantees that the output can be parsed by downstream systems without fear of format errors.32

## **Best Practices for Preventing Drift and Ensuring Consistency**

The integration of the researched frameworks leads to a set of best practices designed for system-level stability in generative pipelines. These practices move beyond "prompt tips" into the realm of architectural design.

### **Asynchronous Denoising and Semantic Anchoring**

To solve the "texture dominance" problem, systems should implement the "Semantic-First" paradigm. This involves extracting a compact semantic latent from a pre-trained visual encoder and using it as a "semantic anchor".5 By setting a temporal offset between the semantic and texture noise schedules, the system ensures the object's form is established while the noise level is still high enough to allow for structural adjustments, and only then allows the model to commit to specific pixel-level textures.5

### **Rejection Sampling and Iterative Refinement**

For high-stakes visualizations, a single-pass generation is rarely sufficient. A robust pipeline should employ a "Two-Stage Fix" 12:

1. **Quality Filter (Rejection Sampling)**: Generate a small batch (4-8 images) for a given object definition. Use an automated quality scorer (such as a CLIP-based aesthetic score or a custom VQA reward model) to select the highest-fidelity output.3  
2. **Fidelity Boost (Iterative Refinement)**: Take the best image, "re-noise" it slightly, and run it through a few additional denoising steps. This forces the model to re-evaluate and "fix" tiny imperfections (like muddy hands or inconsistent gears) while keeping the global structure intact.12

### **Anisotropic Variance and Edge Preservation**

Standard diffusion models should be augmented with edge-aware noise schedulers. By suppressing noise in regions with high image gradients (edges), the generative process can preserve structural details significantly earlier in the timeline.13 This prevents the "melting" effect where an object's boundary becomes indistinguishable from its environment during the mid-steps of diffusion.

### **Data Normalization and Scaling**

For pipelines using reference images (like IP-Adapter or ControlNet), "Crop-First" normalization is essential.35 Transforms like dropout, noise, and blur are resolution-dependent. A 32x32 dropout hole on a 1024x1024 reference image is 16 times less impactful than the same hole on a 256x256 target image. Systems must crop or resize references to the target resolution before applying augmentations to ensure that the "impact" of the control signal remains consistent across the pipeline.35

### **Physics-Informed and Data-Informed Constraints**

In industrial and scientific use cases, object definitions should include physical constraints.30 Tools like NVIDIA Modulus and PhysicsNeMo Sym allow for the definition of "Continuous Constraints" applied uniformly randomly across the geometry's surface.30 For example, a generated object's surface must satisfy specific Partial Differential Equations (PDEs) for fluid flow or heat distribution. By adding these as training objectives, the system ensures that the generated "object" is not just a picture, but a physically plausible model.30

## **Synthesis: The Future of Object-Oriented Generative Design**

The shift toward defining objects before generation is essentially a move toward "Visual Compilers." Just as a software compiler translates structured code into machine instructions, these generative systems translate structured object data into latent space operations. The "abstract drift" that has plagued the first generation of AI art is a symptom of a lack of grounding—a disconnect between the model's stochastic nature and the human world's structural reality.11

As frameworks like GLIGEN, Decomp Diffusion, and NVIDIA Edify converge, the "object" will no longer be a latent hallucination but a "deterministic asset" that can be verified, audited, and reused.2 The role of the designer will transition from "prompting" to "system architecture," defining the metadata, hierarchical relationships, and physical constraints that govern the generation of a high-fidelity visual world. This approach ensures that identity stability and readability are not emergent properties of a lucky seed, but the guaranteed results of a well-engineered system.3

#### **Nguồn trích dẫn**

1. Item \- Identity Preservation and Content Control in Generative Image ..., truy cập vào tháng 4 6, 2026, [https://hammer.purdue.edu/articles/thesis/\_b\_Identity\_Preservation\_and\_Content\_Control\_in\_Generative\_Image\_Customization\_b\_/28908611](https://hammer.purdue.edu/articles/thesis/_b_Identity_Preservation_and_Content_Control_in_Generative_Image_Customization_b_/28908611)  
2. GLIGEN:Open-Set Grounded Text-to-Image Generation., truy cập vào tháng 4 6, 2026, [https://gligen.github.io/](https://gligen.github.io/)  
3. Scene graph driven data synthesis for Visual Generation Training \- arXiv, truy cập vào tháng 4 6, 2026, [https://arxiv.org/html/2412.08221v4](https://arxiv.org/html/2412.08221v4)  
4. The Best Open-Source Image Generation Models in 2026 \- BentoML, truy cập vào tháng 4 6, 2026, [https://www.bentoml.com/blog/a-guide-to-open-source-image-generation-models](https://www.bentoml.com/blog/a-guide-to-open-source-image-generation-models)  
5. Paper page \- Semantics Lead the Way: Harmonizing Semantic and ..., truy cập vào tháng 4 6, 2026, [https://huggingface.co/papers/2512.04926](https://huggingface.co/papers/2512.04926)  
6. GLIGEN with Gradient \- Paperspace Blog, truy cập vào tháng 4 6, 2026, [https://blog.paperspace.com/gligen/](https://blog.paperspace.com/gligen/)  
7. Scene Graph Generation and its Application in Robotics | by Ritanshi Agarwal \- Medium, truy cập vào tháng 4 6, 2026, [https://medium.com/data-science/scene-graph-generation-and-its-application-in-robotics-f9ba864aa572](https://medium.com/data-science/scene-graph-generation-and-its-application-in-robotics-f9ba864aa572)  
8. Advancements, Challenges, and Future Directions in Scene-Graph-Based Image Generation: A Comprehensive Review \- MDPI, truy cập vào tháng 4 6, 2026, [https://www.mdpi.com/2079-9292/14/6/1158](https://www.mdpi.com/2079-9292/14/6/1158)  
9. ID-Booth: Identity-consistent Face Generation with Diffusion Models \- arXiv, truy cập vào tháng 4 6, 2026, [https://arxiv.org/html/2504.07392v6](https://arxiv.org/html/2504.07392v6)  
10. A Phase Transition in Diffusion Models Reveals the Hierarchical Nature of Data \- arXiv, truy cập vào tháng 4 6, 2026, [https://arxiv.org/html/2402.16991v3](https://arxiv.org/html/2402.16991v3)  
11. Consistent Diffusion Models: Mitigating Sampling Drift by Learning to be Consistent, truy cập vào tháng 4 6, 2026, [https://proceedings.neurips.cc/paper\_files/paper/2023/hash/831406cfe7e4a0aed5ac5c8a8389d1f5-Abstract-Conference.html](https://proceedings.neurips.cc/paper_files/paper/2023/hash/831406cfe7e4a0aed5ac5c8a8389d1f5-Abstract-Conference.html)  
12. Stop Your Diffusion Models From Hallucinating: A Simple Trick to Get Way Better Image Quality \- Reddit, truy cập vào tháng 4 6, 2026, [https://www.reddit.com/r/PromptEngineering/comments/1p6krn8/stop\_your\_diffusion\_models\_from\_hallucinating\_a/](https://www.reddit.com/r/PromptEngineering/comments/1p6krn8/stop_your_diffusion_models_from_hallucinating_a/)  
13. Edge-preserving noise for diffusion models, truy cập vào tháng 4 6, 2026, [https://edge-preserving-diffusion.mpi-inf.mpg.de/](https://edge-preserving-diffusion.mpi-inf.mpg.de/)  
14. PBR3DGen: A VLM-Guided Mesh Generation with High-Quality PBR Texture, truy cập vào tháng 4 6, 2026, [https://ojs.aaai.org/index.php/AAAI/article/view/38030/41992](https://ojs.aaai.org/index.php/AAAI/article/view/38030/41992)  
15. Composable Part-Based Manipulation \- OpenReview, truy cập vào tháng 4 6, 2026, [https://openreview.net/forum?id=o-K3HVUeEw](https://openreview.net/forum?id=o-K3HVUeEw)  
16. Compositional Image Decomposition with Diffusion Models \- OpenReview, truy cập vào tháng 4 6, 2026, [https://openreview.net/pdf/6a53a10d59984c4ecee11dd1d94e05077e6b3c81.pdf](https://openreview.net/pdf/6a53a10d59984c4ecee11dd1d94e05077e6b3c81.pdf)  
17. Compositional Image Decomposition with Diffusion Models \- arXiv, truy cập vào tháng 4 6, 2026, [https://arxiv.org/html/2406.19298v1](https://arxiv.org/html/2406.19298v1)  
18. Compositional Image Decomposition with Diffusion Models, truy cập vào tháng 4 6, 2026, [https://energy-based-model.github.io/decomp-diffusion/](https://energy-based-model.github.io/decomp-diffusion/)  
19. Human-Object Interaction via Automatically Designed VLM-Guided Motion Policy, truy cập vào tháng 4 6, 2026, [https://openreview.net/forum?id=LfkPlFTfe0](https://openreview.net/forum?id=LfkPlFTfe0)  
20. ControlNet+⁣+: Improving Conditional Controls with Efficient Consistency Feedback Project Page: liming-ai.github.io/ControlNet\_Plus\_Plus \- arXiv, truy cập vào tháng 4 6, 2026, [https://arxiv.org/html/2404.07987v4](https://arxiv.org/html/2404.07987v4)  
21. Hierarchical Diffusion Motion Planning with Task-Conditioned Uncertainty-Aware Priors, truy cập vào tháng 4 6, 2026, [https://arxiv.org/html/2509.25685v1](https://arxiv.org/html/2509.25685v1)  
22. SuperMat: Physically Consistent PBR Material Estimation at Interactive Rates \- CVF Open Access, truy cập vào tháng 4 6, 2026, [https://openaccess.thecvf.com/content/ICCV2025/papers/Hong\_SuperMat\_Physically\_Consistent\_PBR\_Material\_Estimation\_at\_Interactive\_Rates\_ICCV\_2025\_paper.pdf](https://openaccess.thecvf.com/content/ICCV2025/papers/Hong_SuperMat_Physically_Consistent_PBR_Material_Estimation_at_Interactive_Rates_ICCV_2025_paper.pdf)  
23. MCMat: Multiview-Consistent and Physically Accurate PBR Material Generation \- arXiv, truy cập vào tháng 4 6, 2026, [https://arxiv.org/html/2412.14148v1](https://arxiv.org/html/2412.14148v1)  
24. VideoMat: Extracting PBR Materials from Video Diffusion Models \- arXiv, truy cập vào tháng 4 6, 2026, [https://arxiv.org/html/2506.09665v1](https://arxiv.org/html/2506.09665v1)  
25. Workflows \- ComfyUI \- Mintlify, truy cập vào tháng 4 6, 2026, [https://www.mintlify.com/Comfy-Org/ComfyUI/concepts/workflows](https://www.mintlify.com/Comfy-Org/ComfyUI/concepts/workflows)  
26. Edify 3D: Scalable High-Quality 3D Asset Generation \- arXiv, truy cập vào tháng 4 6, 2026, [https://arxiv.org/html/2411.07135v1](https://arxiv.org/html/2411.07135v1)  
27. Edify Helps Developers Create Custom Models \- NVIDIA Blog, truy cập vào tháng 4 6, 2026, [https://blogs.nvidia.com/blog/ai-decoded-edify/](https://blogs.nvidia.com/blog/ai-decoded-edify/)  
28. Workflow \- ComfyUI Official Documentation, truy cập vào tháng 4 6, 2026, [https://docs.comfy.org/development/core-concepts/workflow](https://docs.comfy.org/development/core-concepts/workflow)  
29. Properties \- ComfyUI Official Documentation, truy cập vào tháng 4 6, 2026, [https://docs.comfy.org/custom-nodes/backend/server\_overview](https://docs.comfy.org/custom-nodes/backend/server_overview)  
30. Constraints \- NVIDIA Docs, truy cập vào tháng 4 6, 2026, [https://docs.nvidia.com/deeplearning/modulus/modulus-v2209/user\_guide/features/constraints.html](https://docs.nvidia.com/deeplearning/modulus/modulus-v2209/user_guide/features/constraints.html)  
31. Constraints — NVIDIA PhysicsNeMo Framework, truy cập vào tháng 4 6, 2026, [https://docs.nvidia.com/physicsnemo/25.08/physicsnemo-sym/user\_guide/features/constraints.html](https://docs.nvidia.com/physicsnemo/25.08/physicsnemo-sym/user_guide/features/constraints.html)  
32. Structured Output Generation in LLMs: JSON Schema and Grammar-Based Decoding | by Emre Karatas | Medium, truy cập vào tháng 4 6, 2026, [https://medium.com/@emrekaratas-ai/structured-output-generation-in-llms-json-schema-and-grammar-based-decoding-6a5c58b698a6](https://medium.com/@emrekaratas-ai/structured-output-generation-in-llms-json-schema-and-grammar-based-decoding-6a5c58b698a6)  
33. What Is JSON Schema? | Postman Blog, truy cập vào tháng 4 6, 2026, [https://blog.postman.com/what-is-json-schema/](https://blog.postman.com/what-is-json-schema/)  
34. Creating a schema for hierarchies | Amplience Documentation, truy cập vào tháng 4 6, 2026, [https://amplience.com/developers/docs/dev-tools/content-modeling/hierarchies/hierarchy-schemas/](https://amplience.com/developers/docs/dev-tools/content-modeling/hierarchies/hierarchy-schemas/)  
35. Designing Image Augmentation Pipelines for Generalization | by Vladimir Iglovikov | Data Science Collective \- Medium, truy cập vào tháng 4 6, 2026, [https://medium.com/data-science-collective/designing-image-augmentation-pipelines-for-generalization-218290c2e56b](https://medium.com/data-science-collective/designing-image-augmentation-pipelines-for-generalization-218290c2e56b)  
36. Image schema \- Wikipedia, truy cập vào tháng 4 6, 2026, [https://en.wikipedia.org/wiki/Image\_schema](https://en.wikipedia.org/wiki/Image_schema)

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAYCAYAAAAs7gcTAAAAuklEQVR4XmNgGAX0BhxA7ADErkDMiSoFlgNhMHAC4tdA/B+K9wAxP1SOFYgnArEKiKMNxPeBuBWI9YE4AogfAXE5VLElELcAMSOI0wfEwVAJGAAZsAGIhYG4C4h1YBKCQMwM40AByBSQ1SBbQIpZUKUxQSkQn2GAOIMgCALiEwwIj+IFvkCcgy6IC9QAsQ26IDYA8vQ2INZEl8AGjIF4NwNEE0EQDcST0AVxgUIg9kAXxAVAkQSOXvoAAAo9FUIxQs5QAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAYCAYAAAD3Va0xAAABFklEQVR4Xu3TvUoDQRSG4RM0oKQQm1jYpIiCYGdrY0jhJUSMVxCwFbEJWNgLdvY2NoLeQ34KGyGVoI1FglpZhfy8h5lhZyfBSfr94GHZOcPumcOuSJZlc4QBJp4fnHl7roP6EwpePZV7jFENC2QHbdSxFtRS2UQXH9hOl6SCZ5SC9bnZwzdeJHnjCs5xg3W7Fs2pmLNf2Hs9/52YOeXcpkVyiyEOsYtXtLDhb4rFzecTDTyIeYgO/tjbF42bzwhXyKMm5qj60NVk6/9x87mUZB5b6OEX+3YtGv1+3Hz8NMW8QK/RuPm8i+nCj3aiHWlnYW0mB/jDo8zOQu91XbvSL3pu9Df4kvT/08eJrRfRCepvKNt6lixTa1A8Ip1plLwAAAAASUVORK5CYII=>