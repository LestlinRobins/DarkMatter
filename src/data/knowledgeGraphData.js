// Comprehensive NASA OSDR Knowledge Graph Data
export const knowledgeGraphData = {
  nodes: [
    // === MUSCLE PHYSIOLOGY CATEGORY ===
    {
      id: "muscle",
      label: "Muscle Physiology",
      type: "category",
      pdf_url: "https://osdr.nasa.gov/pdf/muscle_overview.pdf",
    },
    {
      id: "muscle_iss1",
      label: "ISS Muscle Atrophy Study 2020",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/iss_muscle_study_2020.pdf",
      parent: "muscle",
    },
    {
      id: "muscle_iss2",
      label: "Microgravity Muscle Protein Study",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/muscle_protein_study.pdf",
      parent: "muscle",
    },
    {
      id: "muscle_ground1",
      label: "Ground-based Bed Rest Study",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/bed_rest_muscle.pdf",
      parent: "muscle",
    },

    // === IMMUNE RESPONSE CATEGORY ===
    {
      id: "immune",
      label: "Immune Response",
      type: "category",
      pdf_url: "https://osdr.nasa.gov/pdf/immune_overview.pdf",
    },
    {
      id: "immune_iss1",
      label: "ISS Immune Function Study 2020",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/iss_immune_study_2020.pdf",
      parent: "immune",
    },
    {
      id: "immune_cells1",
      label: "T-Cell Response in Microgravity",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/tcell_microgravity.pdf",
      parent: "immune",
    },
    {
      id: "immune_cytokine1",
      label: "Cytokine Production Study",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/cytokine_production.pdf",
      parent: "immune",
    },

    // === PLANT BIOLOGY CATEGORY ===
    {
      id: "plants",
      label: "Plant Biology",
      type: "category",
      pdf_url: "https://osdr.nasa.gov/pdf/plant_overview.pdf",
    },
    {
      id: "plants_shuttle1",
      label: "Shuttle Plant Growth Study 2019",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/shuttle_plant_study_2019.pdf",
      parent: "plants",
    },
    {
      id: "plants_iss1",
      label: "ISS Arabidopsis Experiment",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/arabidopsis_iss.pdf",
      parent: "plants",
    },
    {
      id: "plants_root1",
      label: "Root Development in Zero-G",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/root_development.pdf",
      parent: "plants",
    },
    {
      id: "plants_photosynthesis1",
      label: "Photosynthesis Efficiency Study",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/photosynthesis_study.pdf",
      parent: "plants",
    },

    // === RADIATION BIOLOGY CATEGORY ===
    {
      id: "radiation",
      label: "Radiation Biology",
      type: "category",
      pdf_url: "https://osdr.nasa.gov/pdf/radiation_overview.pdf",
    },
    {
      id: "radiation_dna1",
      label: "DNA Damage from Cosmic Rays",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/dna_cosmic_rays.pdf",
      parent: "radiation",
    },
    {
      id: "radiation_cancer1",
      label: "Cancer Risk Assessment",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/cancer_risk_space.pdf",
      parent: "radiation",
    },
    {
      id: "radiation_shield1",
      label: "Radiation Shielding Study",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/radiation_shielding.pdf",
      parent: "radiation",
    },

    // === MICROGRAVITY EFFECTS CATEGORY ===
    {
      id: "microgravity",
      label: "Microgravity Effects",
      type: "category",
      pdf_url: "https://osdr.nasa.gov/pdf/microgravity_overview.pdf",
    },
    {
      id: "microgravity_cells1",
      label: "Cell Culture in Microgravity",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/cell_culture_microgravity.pdf",
      parent: "microgravity",
    },
    {
      id: "microgravity_tissue1",
      label: "Tissue Engineering Study",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/tissue_engineering_study.pdf",
      parent: "microgravity",
    },
    {
      id: "microgravity_organ1",
      label: "Organ Development Research",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/organ_development.pdf",
      parent: "microgravity",
    },

    // === CARDIOVASCULAR CATEGORY ===
    {
      id: "cardiovascular",
      label: "Cardiovascular Health",
      type: "category",
      pdf_url: "https://osdr.nasa.gov/pdf/cardiovascular_overview.pdf",
    },
    {
      id: "cardiovascular_iss1",
      label: "ISS Heart Function Study",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/heart_function_iss.pdf",
      parent: "cardiovascular",
    },
    {
      id: "cardiovascular_fluid1",
      label: "Fluid Shift Analysis",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/fluid_shift_study.pdf",
      parent: "cardiovascular",
    },
    {
      id: "cardiovascular_exercise1",
      label: "Exercise Countermeasures",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/exercise_countermeasures.pdf",
      parent: "cardiovascular",
    },

    // === NEUROLOGICAL CATEGORY ===
    {
      id: "neurological",
      label: "Neurological Changes",
      type: "category",
      pdf_url: "https://osdr.nasa.gov/pdf/neuro_overview.pdf",
    },
    {
      id: "neuro_cognition1",
      label: "Cognitive Performance Study",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/cognitive_performance.pdf",
      parent: "neurological",
    },
    {
      id: "neuro_vision1",
      label: "Vision Impairment Research",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/vision_impairment.pdf",
      parent: "neurological",
    },
    {
      id: "neuro_sleep1",
      label: "Sleep Pattern Analysis",
      type: "sub-category",
      pdf_url: "https://osdr.nasa.gov/pdf/sleep_patterns.pdf",
      parent: "neurological",
    },
  ],
  edges: [
    // === PARENT-CHILD RELATIONSHIPS ===
    { source: "muscle_iss1", target: "muscle", relation: "belongs_to" },
    { source: "muscle_iss2", target: "muscle", relation: "belongs_to" },
    { source: "muscle_ground1", target: "muscle", relation: "belongs_to" },

    { source: "immune_iss1", target: "immune", relation: "belongs_to" },
    { source: "immune_cells1", target: "immune", relation: "belongs_to" },
    { source: "immune_cytokine1", target: "immune", relation: "belongs_to" },

    { source: "plants_shuttle1", target: "plants", relation: "belongs_to" },
    { source: "plants_iss1", target: "plants", relation: "belongs_to" },
    { source: "plants_root1", target: "plants", relation: "belongs_to" },
    {
      source: "plants_photosynthesis1",
      target: "plants",
      relation: "belongs_to",
    },

    { source: "radiation_dna1", target: "radiation", relation: "belongs_to" },
    {
      source: "radiation_cancer1",
      target: "radiation",
      relation: "belongs_to",
    },
    {
      source: "radiation_shield1",
      target: "radiation",
      relation: "belongs_to",
    },

    {
      source: "microgravity_cells1",
      target: "microgravity",
      relation: "belongs_to",
    },
    {
      source: "microgravity_tissue1",
      target: "microgravity",
      relation: "belongs_to",
    },
    {
      source: "microgravity_organ1",
      target: "microgravity",
      relation: "belongs_to",
    },

    {
      source: "cardiovascular_iss1",
      target: "cardiovascular",
      relation: "belongs_to",
    },
    {
      source: "cardiovascular_fluid1",
      target: "cardiovascular",
      relation: "belongs_to",
    },
    {
      source: "cardiovascular_exercise1",
      target: "cardiovascular",
      relation: "belongs_to",
    },

    {
      source: "neuro_cognition1",
      target: "neurological",
      relation: "belongs_to",
    },
    { source: "neuro_vision1", target: "neurological", relation: "belongs_to" },
    { source: "neuro_sleep1", target: "neurological", relation: "belongs_to" },

    // === CROSS-CATEGORY RELATIONSHIPS ===

    // Muscle <-> Cardiovascular (exercise and deconditioning)
    {
      source: "muscle",
      target: "cardiovascular",
      relation: "physiological_interaction",
    },
    {
      source: "muscle_iss1",
      target: "cardiovascular_exercise1",
      relation: "countermeasure_strategy",
    },

    // Immune <-> Radiation (radiation effects on immunity)
    { source: "immune", target: "radiation", relation: "biological_impact" },
    {
      source: "immune_cells1",
      target: "radiation_dna1",
      relation: "cellular_damage_response",
    },

    // Microgravity <-> Multiple systems (fundamental environment factor)
    {
      source: "microgravity",
      target: "muscle",
      relation: "environmental_stressor",
    },
    {
      source: "microgravity",
      target: "cardiovascular",
      relation: "environmental_stressor",
    },
    {
      source: "microgravity",
      target: "plants",
      relation: "growth_environment",
    },

    // Plant Biology <-> Radiation (space agriculture considerations)
    {
      source: "plants",
      target: "radiation",
      relation: "environmental_challenge",
    },
    {
      source: "plants_photosynthesis1",
      target: "radiation_shield1",
      relation: "protection_strategy",
    },

    // Neurological <-> Cardiovascular (fluid shift effects)
    {
      source: "neurological",
      target: "cardiovascular",
      relation: "systemic_interaction",
    },
    {
      source: "neuro_vision1",
      target: "cardiovascular_fluid1",
      relation: "shared_mechanism",
    },

    // Immune <-> Muscle (inflammation and recovery)
    { source: "immune", target: "muscle", relation: "inflammatory_response" },
    {
      source: "immune_cytokine1",
      target: "muscle_iss2",
      relation: "protein_regulation",
    },

    // Cross-study collaborations
    {
      source: "muscle_iss1",
      target: "immune_iss1",
      relation: "concurrent_study",
    },
    {
      source: "plants_iss1",
      target: "microgravity_cells1",
      relation: "shared_platform",
    },
    {
      source: "cardiovascular_iss1",
      target: "neuro_cognition1",
      relation: "integrated_assessment",
    },

    // Research methodology connections
    {
      source: "muscle_ground1",
      target: "cardiovascular_exercise1",
      relation: "ground_validation",
    },
    {
      source: "radiation_cancer1",
      target: "immune_cells1",
      relation: "risk_assessment",
    },
    {
      source: "plants_root1",
      target: "microgravity_organ1",
      relation: "development_analogy",
    },
  ],
};
