import type { Publication, Constellation } from "./types";

// Sample NASA bioscience publications data
// In a real implementation, this would be loaded from the NASA repository

export const mockPublications: Publication[] = [
  {
    id: "001",
    title: "Mice in Bion-M 1 space mission: training and selection",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Training and selection protocols for mice in the Bion-M 1 space mission.",
    category: "Animal Models",
    tags: ["mice", "training", "selection", "Bion-M1"],
    citations: 0,
    connections: ["002", "003", "004"],
    position: [0, 0, 0],
  },
  {
    id: "002",
    title:
      "Microgravity induces pelvic bone loss through osteoclastic activity, osteocytic osteolysis, and osteoblastic cell cycle inhibition by CDKN1a/p21",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Mechanisms of bone loss in microgravity environment.",
    category: "Bone & Muscle",
    tags: ["microgravity", "bone loss", "osteoclasts", "CDKN1a"],
    citations: 0,
    connections: ["001", "005", "006"],
    position: [2, -1, 0],
  },
  {
    id: "003",
    title: "Stem Cell Health and Tissue Regeneration in Microgravity",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Effects of microgravity on stem cell function and tissue regeneration.",
    category: "Cell Biology",
    tags: ["stem cells", "regeneration", "microgravity", "tissue"],
    citations: 0,
    connections: ["001", "004", "007"],
    position: [-1, 2, 1],
  },
  {
    id: "004",
    title:
      "Microgravity Reduces the Differentiation and Regenerative Potential of Embryonic Stem Cells",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Impact of microgravity on embryonic stem cell differentiation.",
    category: "Cell Biology",
    tags: ["embryonic stem cells", "differentiation", "microgravity"],
    citations: 0,
    connections: ["003", "008", "009"],
    position: [-2, 1, 2],
  },
  {
    id: "005",
    title:
      "Microgravity validation of a novel system for RNA isolation and multiplex quantitative real time PCR analysis of gene expression on the International Space Station",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Technical validation of RNA analysis systems in microgravity.",
    category: "Technology",
    tags: ["RNA isolation", "PCR", "ISS", "gene expression"],
    citations: 0,
    connections: ["002", "010", "011"],
    position: [1, -2, 0],
  },
  {
    id: "006",
    title:
      "Spaceflight Modulates the Expression of Key Oxidative Stress and Cell Cycle Related Genes in Heart",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Gene expression changes in cardiac tissue during spaceflight.",
    category: "Omics & Genomics",
    tags: ["spaceflight", "oxidative stress", "cell cycle", "heart"],
    citations: 0,
    connections: ["002", "012", "013"],
    position: [3, -1, -1],
  },
  {
    id: "007",
    title:
      "Dose- and Ion-Dependent Effects in the Oxidative Stress Response to Space-Like Radiation Exposure in the Skeletal System",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Radiation effects on skeletal system oxidative stress responses.",
    category: "Radiation Biology",
    tags: ["radiation", "oxidative stress", "skeletal", "dose response"],
    citations: 0,
    connections: ["003", "014", "015"],
    position: [-1, 0, -2],
  },
  {
    id: "008",
    title:
      "From the bench to exploration medicine: NASA life sciences translational research for human exploration and habitation missions",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Translational research applications for space exploration missions.",
    category: "Translational",
    tags: ["exploration medicine", "translational research", "habitation"],
    citations: 0,
    connections: ["004", "016", "017"],
    position: [-3, 2, 1],
  },
  {
    id: "009",
    title:
      "High-precision method for cyclic loading of small-animal vertebrae to assess bone quality",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Methodology for assessing bone quality in small animal models.",
    category: "Technology",
    tags: ["bone quality", "cyclic loading", "vertebrae", "methodology"],
    citations: 0,
    connections: ["004", "018", "019"],
    position: [-2, 0, 3],
  },
  {
    id: "010",
    title:
      "Effects of ex vivo ionizing radiation on collagen structure and whole-bone mechanical properties of mouse vertebrae",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Radiation effects on bone collagen and mechanical properties.",
    category: "Radiation Biology",
    tags: [
      "ionizing radiation",
      "collagen",
      "mechanical properties",
      "vertebrae",
    ],
    citations: 0,
    connections: ["005", "020", "021"],
    position: [2, -3, 1],
  },
  {
    id: "011",
    title:
      "Absence of gamma-sarcoglycan alters the response of p70S6 kinase to mechanical perturbation in murine skeletal muscle",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Role of gamma-sarcoglycan in muscle mechanical responses.",
    category: "Bone & Muscle",
    tags: [
      "gamma-sarcoglycan",
      "p70S6 kinase",
      "skeletal muscle",
      "mechanical",
    ],
    citations: 0,
    connections: ["005", "022", "023"],
    position: [1, -4, 2],
  },
  {
    id: "012",
    title:
      "AtRabD2b and AtRabD2c have overlapping functions in pollen development and pollen tube growth",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Rab GTPase functions in plant reproductive development.",
    category: "Plant Biology",
    tags: ["Rab GTPase", "pollen", "pollen tube", "reproduction"],
    citations: 0,
    connections: ["006", "024", "025"],
    position: [4, -1, -2],
  },
  {
    id: "013",
    title:
      "TNO1 is involved in salt tolerance and vacuolar trafficking in Arabidopsis",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "TNO1 protein role in plant salt tolerance mechanisms.",
    category: "Plant Biology",
    tags: ["TNO1", "salt tolerance", "vacuolar trafficking", "Arabidopsis"],
    citations: 0,
    connections: ["006", "026", "027"],
    position: [3, -2, -1],
  },
  {
    id: "014",
    title:
      "Functional redundancy between trans-Golgi network SNARE family members in Arabidopsis thaliana",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "SNARE protein functional redundancy in plant cells.",
    category: "Cell Biology",
    tags: ["SNARE", "trans-Golgi", "functional redundancy", "Arabidopsis"],
    citations: 0,
    connections: ["007", "028", "029"],
    position: [-1, 1, -3],
  },
  {
    id: "015",
    title: "Root growth movements: Waving and skewing",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Mechanisms of root growth movements in plants.",
    category: "Plant Biology",
    tags: ["root growth", "waving", "skewing", "movements"],
    citations: 0,
    connections: ["007", "030", "031"],
    position: [0, 1, -2],
  },
  {
    id: "016",
    title:
      "Gravitropism and lateral root emergence are dependent on the trans-Golgi network protein TNO1",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "TNO1 role in plant gravitropism and root development.",
    category: "Plant Biology",
    tags: ["gravitropism", "lateral roots", "TNO1", "trans-Golgi"],
    citations: 0,
    connections: ["008", "032", "033"],
    position: [-3, 3, 1],
  },
  {
    id: "017",
    title:
      "TNO1, a TGN-localized SNARE-interacting protein, modulates root skewing in Arabidopsis thaliana",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "TNO1 function in root skewing responses.",
    category: "Plant Biology",
    tags: ["TNO1", "TGN", "SNARE", "root skewing"],
    citations: 0,
    connections: ["008", "034", "035"],
    position: [-4, 2, 0],
  },
  {
    id: "018",
    title:
      "The Drosophila SUN protein Spag4 cooperates with the coiled-coil protein Yuri Gagarin to maintain association of the basal body and spermatid nucleus",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Nuclear envelope proteins in Drosophila spermatogenesis.",
    category: "Cell Biology",
    tags: ["Drosophila", "SUN protein", "Spag4", "spermatogenesis"],
    citations: 0,
    connections: ["009", "036", "037"],
    position: [-2, -1, 4],
  },
  {
    id: "019",
    title:
      "Toll mediated infection response is altered by gravity and spaceflight in Drosophila",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Immune responses in Drosophila during spaceflight.",
    category: "Immunology",
    tags: ["Toll pathway", "infection", "gravity", "Drosophila"],
    citations: 0,
    connections: ["009", "038", "039"],
    position: [-1, -1, 3],
  },
  {
    id: "020",
    title:
      "Multi-omics analysis of multiple missions to space reveal a theme of lipid dysregulation in mouse liver",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Liver lipid metabolism changes during spaceflight missions.",
    category: "Omics & Genomics",
    tags: ["multi-omics", "lipid dysregulation", "liver", "space missions"],
    citations: 0,
    connections: ["010", "040", "041"],
    position: [3, -4, 2],
  },
  {
    id: "021",
    title:
      "GeneLab database analyses suggest long-term impact of space radiation on the cardiovascular system by the activation of FYN through reactive oxygen species",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Long-term cardiovascular effects of space radiation through ROS mechanisms.",
    category: "Omics & Genomics",
    tags: ["GeneLab", "space radiation", "cardiovascular", "FYN", "ROS"],
    citations: 0,
    connections: ["020", "042", "043"],
    position: [4, -5, 1],
  },
  {
    id: "022",
    title: "FAIRness and usability for open-access omics data systems",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Data standards and accessibility for space omics research.",
    category: "Technology",
    tags: ["FAIR", "open-access", "omics", "data systems"],
    citations: 0,
    connections: ["021", "044", "045"],
    position: [5, -4, 0],
  },
  {
    id: "023",
    title:
      "NASA GeneLab platform utilized for biological response to space radiation in animal models",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "GeneLab platform applications in space radiation research.",
    category: "Technology",
    tags: ["GeneLab", "space radiation", "animal models", "platform"],
    citations: 0,
    connections: ["022", "046", "047"],
    position: [4, -3, -1],
  },
  {
    id: "024",
    title:
      "Circulating miRNA spaceflight signature reveals targets for countermeasure development",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "miRNA signatures as biomarkers for spaceflight countermeasures.",
    category: "Omics & Genomics",
    tags: ["miRNA", "spaceflight", "biomarkers", "countermeasures"],
    citations: 0,
    connections: ["023", "048", "049"],
    position: [3, -2, -2],
  },
  {
    id: "025",
    title:
      "Machine learning algorithm to characterize antimicrobial resistance associated with the International Space Station surface microbiome",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "AI-driven analysis of antimicrobial resistance in ISS microbiome.",
    category: "Microbiology",
    tags: ["machine learning", "antimicrobial resistance", "ISS", "microbiome"],
    citations: 0,
    connections: ["024", "050", "051"],
    position: [2, -1, -3],
  },
  {
    id: "026",
    title:
      "Extraterrestrial Gynecology: Could Spaceflight Increase the Risk of Developing Cancer in Female Astronauts? An Updated Review",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Cancer risk assessment for female astronauts during spaceflight.",
    category: "Human Physiology",
    tags: ["gynecology", "cancer risk", "female astronauts", "spaceflight"],
    citations: 0,
    connections: ["025", "052", "053"],
    position: [1, 0, -4],
  },
  {
    id: "027",
    title:
      "Muscle atrophy phenotype gene expression during spaceflight is linked to a metabolic crosstalk in both the liver and the muscle in mice",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Metabolic crosstalk between liver and muscle during spaceflight atrophy.",
    category: "Bone & Muscle",
    tags: ["muscle atrophy", "gene expression", "metabolic crosstalk", "liver"],
    citations: 0,
    connections: ["026", "054", "055"],
    position: [0, 1, -3],
  },
  {
    id: "028",
    title:
      "Chromosomal positioning and epigenetic architecture influence DNA methylation patterns triggered by galactic cosmic radiation",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Epigenetic effects of galactic cosmic radiation on DNA methylation.",
    category: "Radiation Biology",
    tags: [
      "chromosomal positioning",
      "epigenetics",
      "DNA methylation",
      "cosmic radiation",
    ],
    citations: 0,
    connections: ["027", "056", "057"],
    position: [-1, 2, -2],
  },
  {
    id: "029",
    title:
      "A comprehensive SARS-CoV-2 and COVID-19 review, Part 2: Host extracellular to systemic effects of SARS-CoV-2 infection",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Systemic effects of SARS-CoV-2 infection in space environments.",
    category: "Human Physiology",
    tags: ["SARS-CoV-2", "COVID-19", "systemic effects", "space"],
    citations: 0,
    connections: ["028", "058", "059"],
    position: [-2, 3, -1],
  },
  {
    id: "030",
    title: "Aging and putative frailty biomarkers are altered by spaceflight",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Aging and frailty biomarker changes during spaceflight.",
    category: "Human Physiology",
    tags: ["aging", "frailty biomarkers", "spaceflight", "health"],
    citations: 0,
    connections: ["029", "060", "061"],
    position: [-3, 4, 0],
  },
  {
    id: "031",
    title:
      "Space radiation damage rescued by inhibition of key spaceflight associated miRNAs",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "miRNA inhibition as countermeasure for space radiation damage.",
    category: "Radiation Biology",
    tags: ["space radiation", "miRNA inhibition", "countermeasures", "damage"],
    citations: 0,
    connections: ["030", "062", "063"],
    position: [-4, 3, -1],
  },
  {
    id: "032",
    title:
      "Ethical considerations for the age of non-governmental space exploration",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Ethical frameworks for commercial space exploration missions.",
    category: "Translational",
    tags: ["ethics", "commercial space", "exploration", "governance"],
    citations: 0,
    connections: ["031", "064", "065"],
    position: [-5, 2, -2],
  },
  {
    id: "033",
    title:
      "Innate immune responses of Drosophila melanogaster are altered by spaceflight",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Drosophila innate immunity changes during spaceflight.",
    category: "Immunology",
    tags: ["innate immunity", "Drosophila", "spaceflight", "immune response"],
    citations: 0,
    connections: ["032", "066", "067"],
    position: [-4, 1, -3],
  },
  {
    id: "034",
    title:
      "Prolonged Exposure to Microgravity Reduces Cardiac Contractility and Initiates Remodeling in Drosophila",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Cardiac effects of prolonged microgravity exposure in Drosophila.",
    category: "Human Physiology",
    tags: ["microgravity", "cardiac contractility", "remodeling", "Drosophila"],
    citations: 0,
    connections: ["033", "068", "069"],
    position: [-3, 0, -4],
  },
  {
    id: "035",
    title:
      "Regulation of plant gravity sensing and signaling by the actin cytoskeleton",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Actin cytoskeleton role in plant gravitropism mechanisms.",
    category: "Plant Biology",
    tags: [
      "gravitropism",
      "actin cytoskeleton",
      "plant signaling",
      "gravity sensing",
    ],
    citations: 0,
    connections: ["034", "070", "071"],
    position: [-2, 1, -3],
  },
  {
    id: "036",
    title:
      "HLB1 Is a Tetratricopeptide Repeat Domain-Containing Protein That Operates at the Intersection of the Exocytic and Endocytic Pathways at the TGN/EE in Arabidopsis",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "HLB1 protein function in plant membrane trafficking.",
    category: "Cell Biology",
    tags: ["HLB1", "TPR domain", "exocytosis", "endocytosis", "TGN"],
    citations: 0,
    connections: ["035", "072", "073"],
    position: [-1, 2, -2],
  },
  {
    id: "037",
    title:
      "ERULUS is a plasma membrane-localized receptor-like kinase that specifies root hair growth by maintaining tip-focused cytoplasmic calcium oscillations",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "ERULUS kinase role in root hair development and calcium signaling.",
    category: "Plant Biology",
    tags: [
      "ERULUS",
      "receptor-like kinase",
      "root hairs",
      "calcium oscillations",
    ],
    citations: 0,
    connections: ["036", "074", "075"],
    position: [0, 3, -1],
  },
  {
    id: "038",
    title:
      "Brassinosteroids inhibit autotropic root straightening by modifying filamentous-actin organization and dynamics",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Brassinosteroid effects on root growth and actin organization.",
    category: "Plant Biology",
    tags: [
      "brassinosteroids",
      "root straightening",
      "actin organization",
      "growth",
    ],
    citations: 0,
    connections: ["037", "076", "077"],
    position: [1, 4, 0],
  },
  {
    id: "039",
    title:
      "Cell type-specific imaging of calcium signaling in Arabidopsis thaliana seedling roots using GCaMP3",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Calcium imaging techniques for plant root research.",
    category: "Technology",
    tags: ["calcium imaging", "GCaMP3", "Arabidopsis", "root cells"],
    citations: 0,
    connections: ["038", "078", "079"],
    position: [2, 3, 1],
  },
  {
    id: "040",
    title:
      "Spatial and temporal localization of SPIRRIG and WAVE/SCAR reveal roles for these proteins in actin-mediated root hair development",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "SPIRRIG and WAVE/SCAR proteins in root hair actin dynamics.",
    category: "Plant Biology",
    tags: ["SPIRRIG", "WAVE/SCAR", "actin", "root hair development"],
    citations: 0,
    connections: ["039", "080", "081"],
    position: [3, 2, 2],
  },
  {
    id: "041",
    title: "Microgravity Stress: Bone and Connective Tissue",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Comprehensive review of microgravity effects on bone and connective tissues.",
    category: "Bone & Muscle",
    tags: ["microgravity", "bone", "connective tissue", "stress"],
    citations: 0,
    connections: ["040", "082", "083"],
    position: [4, 1, 1],
  },
  {
    id: "042",
    title:
      "S. aureus MscL is a pentamer in vivo but of variable stoichiometries in vitro: implications for detergent-solubilized membrane proteins",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "MscL channel structure and detergent solubilization effects.",
    category: "Cell Biology",
    tags: ["MscL", "pentamer", "membrane proteins", "detergent solubilization"],
    citations: 0,
    connections: ["041", "084", "085"],
    position: [3, 0, 0],
  },
  {
    id: "043",
    title:
      "Manipulating the permeation of charged compounds through the MscL nanovalve",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Control of ion permeation through MscL mechanosensitive channels.",
    category: "Cell Biology",
    tags: ["MscL", "permeation", "charged compounds", "nanovalve"],
    citations: 0,
    connections: ["042", "086", "087"],
    position: [2, -1, -1],
  },
  {
    id: "044",
    title:
      "The oligomeric state of the truncated mechanosensitive channel of large conductance shows no variance in vivo",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "MscL oligomeric structure stability in living systems.",
    category: "Cell Biology",
    tags: ["MscL", "oligomeric state", "mechanosensitive", "in vivo"],
    citations: 0,
    connections: ["043", "088", "089"],
    position: [1, -2, -2],
  },
  {
    id: "045",
    title:
      "Three routes to modulate the pore size of the MscL channel/nanovalve",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Multiple approaches to control MscL channel pore size.",
    category: "Cell Biology",
    tags: ["MscL", "pore size", "modulation", "nanovalve"],
    citations: 0,
    connections: ["044", "090", "091"],
    position: [0, -3, -3],
  },
  {
    id: "046",
    title:
      "The dynamics of protein-protein interactions between domains of MscL at the cytoplasmic-lipid interface",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "MscL protein domain interactions at membrane interfaces.",
    category: "Cell Biology",
    tags: [
      "MscL",
      "protein interactions",
      "cytoplasmic-lipid interface",
      "domains",
    ],
    citations: 0,
    connections: ["045", "092", "093"],
    position: [-1, -4, -4],
  },
  {
    id: "047",
    title:
      "The MscS and MscL families of mechanosensitive channels act as microbial emergency release valves",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Mechanosensitive channels as bacterial osmotic protection mechanisms.",
    category: "Microbiology",
    tags: [
      "MscS",
      "MscL",
      "mechanosensitive",
      "osmotic protection",
      "bacteria",
    ],
    citations: 0,
    connections: ["046", "094", "095"],
    position: [-2, -5, -5],
  },
  {
    id: "048",
    title:
      "Chimeras reveal a single lipid-interface residue that controls MscL channel kinetics as well as mechanosensitivity",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Key residue identification for MscL channel function control.",
    category: "Cell Biology",
    tags: [
      "MscL",
      "chimeras",
      "lipid interface",
      "kinetics",
      "mechanosensitivity",
    ],
    citations: 0,
    connections: ["047", "096", "097"],
    position: [-3, -4, -6],
  },
  {
    id: "049",
    title:
      "Evidence for extensive horizontal gene transfer from the draft genome of a tardigrade",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Horizontal gene transfer analysis in tardigrade genomes.",
    category: "Molecular Biology",
    tags: ["horizontal gene transfer", "tardigrade", "genome", "evolution"],
    citations: 0,
    connections: ["048", "098", "099"],
    position: [-4, -3, -7],
  },
  {
    id: "050",
    title:
      "Reply to Bemm et al. and Arakawa: Identifying foreign genes in independent Hypsibius dujardini genome assemblies",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Response to critiques on tardigrade genome contamination analysis.",
    category: "Molecular Biology",
    tags: ["tardigrade", "genome assembly", "contamination", "foreign genes"],
    citations: 0,
    connections: ["049", "100", "101"],
    position: [-5, -2, -8],
  },
  {
    id: "051",
    title:
      "Tardigrades Use Intrinsically Disordered Proteins to Survive Desiccation",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Intrinsically disordered proteins in tardigrade desiccation tolerance.",
    category: "Molecular Biology",
    tags: ["tardigrades", "disordered proteins", "desiccation", "survival"],
    citations: 0,
    connections: ["050", "102", "103"],
    position: [-6, -1, -9],
  },
  {
    id: "052",
    title: "Desiccation of Hypsibius exemplaris",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Desiccation mechanisms in Hypsibius exemplaris tardigrades.",
    category: "Molecular Biology",
    tags: ["Hypsibius exemplaris", "desiccation", "tardigrades", "mechanisms"],
    citations: 0,
    connections: ["051", "104", "105"],
    position: [-7, 0, -10],
  },
  {
    id: "053",
    title:
      "The biology of tardigrade disordered proteins in extreme stress tolerance",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Role of disordered proteins in tardigrade extreme stress tolerance.",
    category: "Molecular Biology",
    tags: [
      "tardigrades",
      "disordered proteins",
      "stress tolerance",
      "extreme conditions",
    ],
    citations: 0,
    connections: ["052", "106", "107"],
    position: [-8, 1, -11],
  },
  {
    id: "054",
    title:
      "Production of reactive oxygen species and involvement of bioprotectants during anhydrobiosis in the tardigrade Paramacrobiotus spatialis",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "ROS and bioprotectants during tardigrade anhydrobiosis.",
    category: "Molecular Biology",
    tags: ["ROS", "bioprotectants", "anhydrobiosis", "Paramacrobiotus"],
    citations: 0,
    connections: ["053", "108", "109"],
    position: [-9, 2, -12],
  },
  {
    id: "055",
    title:
      "Partial weight suspension: A novel murine model for investigating adaptation to reduced musculoskeletal loading",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Murine model for studying reduced musculoskeletal loading effects.",
    category: "Animal Models",
    tags: [
      "weight suspension",
      "murine model",
      "musculoskeletal loading",
      "adaptation",
    ],
    citations: 0,
    connections: ["054", "110", "111"],
    position: [-8, 3, -11],
  },
  {
    id: "056",
    title:
      "Partial reductions in mechanical loading yield proportional changes in bone density, bone architecture, and muscle mass",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Proportional changes in bone and muscle with reduced mechanical loading.",
    category: "Bone & Muscle",
    tags: [
      "mechanical loading",
      "bone density",
      "bone architecture",
      "muscle mass",
    ],
    citations: 0,
    connections: ["055", "112", "113"],
    position: [-7, 4, -10],
  },
  {
    id: "057",
    title:
      "Spaceflight and hind limb unloading induce similar changes in electrical impedance characteristics of mouse gastrocnemius muscle",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Electrical impedance changes in mouse muscle during spaceflight and unloading.",
    category: "Bone & Muscle",
    tags: [
      "spaceflight",
      "hind limb unloading",
      "electrical impedance",
      "gastrocnemius",
    ],
    citations: 0,
    connections: ["056", "114", "115"],
    position: [-6, 5, -9],
  },
  {
    id: "058",
    title: "Spaceflight Activates Lipotoxic Pathways in Mouse Liver",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Lipotoxic pathway activation in mouse liver during spaceflight.",
    category: "Omics & Genomics",
    tags: ["spaceflight", "lipotoxic pathways", "liver", "metabolism"],
    citations: 0,
    connections: ["057", "116", "117"],
    position: [-5, 4, -8],
  },
  {
    id: "059",
    title:
      "Treatment with a soluble bone morphogenetic protein type 1A receptor (BMPR1A) fusion protein increases bone mass and bone formation in mice subjected to hindlimb unloading",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "BMPR1A fusion protein treatment for bone loss countermeasures.",
    category: "Bone & Muscle",
    tags: ["BMPR1A", "fusion protein", "bone mass", "hindlimb unloading"],
    citations: 0,
    connections: ["058", "118", "119"],
    position: [-4, 3, -7],
  },
  {
    id: "060",
    title:
      "RNAseq and RNA molecular barcoding reveal differential gene expression in cortical bone following hindlimb unloading in female mice",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "RNA-seq analysis of cortical bone gene expression during unloading.",
    category: "Omics & Genomics",
    tags: [
      "RNA-seq",
      "molecular barcoding",
      "cortical bone",
      "hindlimb unloading",
    ],
    citations: 0,
    connections: ["059", "120", "121"],
    position: [-3, 2, -6],
  },
  {
    id: "061",
    title:
      "Proteomic and phosphoproteomic characterization of cardiovascular tissues after long term exposure to simulated space radiation",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Proteomic analysis of cardiovascular tissues after space radiation exposure.",
    category: "Omics & Genomics",
    tags: [
      "proteomics",
      "phosphoproteomics",
      "cardiovascular",
      "space radiation",
    ],
    citations: 0,
    connections: ["060", "122", "123"],
    position: [-2, 1, -5],
  },
  {
    id: "062",
    title:
      "Adaptive Changes in the Vestibular System of Land Snail to a 30-Day Spaceflight and Readaptation on Return to Earth",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Vestibular system adaptations in land snails during spaceflight.",
    category: "Neuroscience",
    tags: ["vestibular system", "land snail", "spaceflight", "adaptation"],
    citations: 0,
    connections: ["061", "124", "125"],
    position: [-1, 0, -4],
  },
  {
    id: "063",
    title:
      "Morphology of the Utricular Otolith Organ in the Toadfish, Opsanus tau",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Utricular otolith morphology in toadfish vestibular system.",
    category: "Neuroscience",
    tags: ["utricular otolith", "toadfish", "Opsanus tau", "vestibular"],
    citations: 0,
    connections: ["062", "126", "127"],
    position: [0, -1, -3],
  },
  {
    id: "064",
    title:
      "Influence of Magnitude and Duration of Altered Gravity and Readaptation to 1g on the Structure and Function of the Utricle in Toadfish, Opsanus tau",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Gravity effects on toadfish utricle structure and function.",
    category: "Neuroscience",
    tags: ["altered gravity", "utricle", "toadfish", "readaptation"],
    citations: 0,
    connections: ["063", "128", "129"],
    position: [1, -2, -2],
  },
  {
    id: "065",
    title:
      "Organization of the ER-Golgi interface for membrane traffic control",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "ER-Golgi interface organization for membrane trafficking control.",
    category: "Cell Biology",
    tags: ["ER-Golgi", "membrane traffic", "organelles", "trafficking"],
    citations: 0,
    connections: ["064", "130", "131"],
    position: [2, -3, -1],
  },
  {
    id: "066",
    title: "IRE1: ER stress sensor and cell fate executor",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "IRE1 protein function in ER stress sensing and cell fate decisions.",
    category: "Cell Biology",
    tags: ["IRE1", "ER stress", "cell fate", "stress response"],
    citations: 0,
    connections: ["065", "132", "133"],
    position: [3, -4, 0],
  },
  {
    id: "067",
    title:
      "Inter-regulation of the unfolded protein response and auxin signaling",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract:
      "Cross-regulation between unfolded protein response and auxin signaling.",
    category: "Plant Biology",
    tags: [
      "unfolded protein response",
      "auxin signaling",
      "plant hormones",
      "stress",
    ],
    citations: 0,
    connections: ["066", "134", "135"],
    position: [4, -5, 1],
  },
  {
    id: "068",
    title: "Endoplasmic reticulum-shape and function in stress translation",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "ER shape and function relationships during stress translation.",
    category: "Cell Biology",
    tags: [
      "endoplasmic reticulum",
      "ER shape",
      "stress translation",
      "function",
    ],
    citations: 0,
    connections: ["067", "136", "137"],
    position: [5, -6, 2],
  },
  {
    id: "069",
    title:
      "Galactose-depleted xycoglucan is dysfunctional and leads to dwarfism in Arabidopsis",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Xyloglucan galactose depletion effects on Arabidopsis growth.",
    category: "Plant Biology",
    tags: ["xyloglucan", "galactose", "dwarfism", "Arabidopsis"],
    citations: 0,
    connections: ["068", "138", "139"],
    position: [6, -5, 3],
  },
  {
    id: "070",
    title: "Unfolded protein response in plants: one master, many questions",
    authors: ["NASA Research Team"],
    year: 2023,
    abstract: "Review of unfolded protein response mechanisms in plants.",
    category: "Plant Biology",
    tags: ["unfolded protein response", "plants", "stress response", "review"],
    citations: 0,
    connections: ["069", "140", "141"],
    position: [5, -4, 4],
  },
];

export const categories = {
  "Human Physiology": {
    color: "#FF6B6B",
    description: "Studies on human body systems in space",
  },
  "Plant Biology": {
    color: "#4ECDC4",
    description: "Research on plants and food production",
  },
  "Radiation Biology": {
    color: "#FFE66D",
    description: "Understanding and mitigating radiation effects",
  },
  Microbiology: {
    color: "#95E1D3",
    description: "Microbial life support and contamination",
  },
  "Molecular Biology": {
    color: "#AA96DA",
    description: "Genetic and molecular responses to space",
  },
  Immunology: {
    color: "#FCBAD3",
    description: "Immune system function in space",
  },
  "Bone & Muscle": {
    color: "#A8E6CF",
    description: "Skeletal and muscular adaptations to spaceflight",
  },
  Neuroscience: {
    color: "#FFD93D",
    description: "Brain and nervous system responses to space",
  },
  "Cell Biology": {
    color: "#B4A7D6",
    description: "Cellular mechanisms and responses",
  },
  "Omics & Genomics": {
    color: "#FF9A9E",
    description: "Genomics, transcriptomics, and systems biology",
  },
  "Animal Models": {
    color: "#81C784",
    description: "Research using model organisms in space",
  },
  Technology: {
    color: "#FFB74D",
    description: "Hardware, tools, and methods for space biology",
  },
  Environmental: {
    color: "#4DB6AC",
    description: "Environmental factors and space conditions",
  },
  Translational: {
    color: "#F06292",
    description: "Applications for Earth and space exploration",
  },
};

// Function to simulate AI-powered search
export function searchPublications(query: string): Publication[] {
  const lowerQuery = query.toLowerCase();
  return mockPublications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(lowerQuery) ||
      pub.abstract.toLowerCase().includes(lowerQuery) ||
      pub.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      pub.category.toLowerCase().includes(lowerQuery)
  );
}

// Function to get related publications
export function getRelatedPublications(pubId: string): Publication[] {
  const pub = mockPublications.find((p) => p.id === pubId);
  if (!pub) return [];
  return mockPublications.filter((p) => pub.connections.includes(p.id));
}

// Function to get statistics
export interface Statistics {
  totalPublications: number;
  totalCitations: number;
  categoriesCount: number;
  averageCitationsPerPaper: number;
  topCategory: string;
}

export function getStatistics(): Statistics {
  const totalPublications = mockPublications.length;
  const totalCitations = mockPublications.reduce(
    (sum, pub) => sum + pub.citations,
    0
  );
  const categoriesCount = Object.keys(categories).length;
  const averageCitationsPerPaper = Math.round(
    totalCitations / totalPublications
  );

  const categoryCount: Record<string, number> = {};
  mockPublications.forEach((pub) => {
    categoryCount[pub.category] = (categoryCount[pub.category] || 0) + 1;
  });

  const topCategory = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  return {
    totalPublications,
    totalCitations,
    categoriesCount,
    averageCitationsPerPaper,
    topCategory,
  };
}

// Function to create a realistic universe with galaxies
export function createConstellations(): Constellation[] {
  const constellations: Constellation[] = [];

  // Group publications by category
  const publicationsByCategory: Record<string, Publication[]> = {};
  mockPublications.forEach((pub) => {
    if (!publicationsByCategory[pub.category]) {
      publicationsByCategory[pub.category] = [];
    }
    publicationsByCategory[pub.category].push(pub);
  });

  // Create array of categories sorted by number of publications
  const sortedCategories = Object.entries(publicationsByCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([category]) => category);

  const numberOfGalaxies = sortedCategories.length; // One galaxy per category

  // Constants for galaxy distribution
  const minRadius = 35; // Minimum distance from center
  const maxRadius = 100; // Maximum distance from center
  const verticalSpread = 20; // Maximum vertical displacement
  const spiralArms = 3; // Number of spiral arms in the universe
  const spiralTightness = 0.6; // How tight the spiral arms are

  // Helper function to create a realistic spiral arm distribution
  const getSpiralPosition = (index: number, totalGalaxies: number) => {
    const progressAlongSpiral = index / totalGalaxies;
    const armIndex = index % spiralArms;
    const baseAngle = (armIndex / spiralArms) * Math.PI * 2;
    const spiralAngle =
      baseAngle + progressAlongSpiral * Math.PI * 3 * spiralTightness;
    const radiusProgression =
      progressAlongSpiral * (maxRadius - minRadius) + minRadius;

    // Add some randomness to make it more natural
    const randomOffset = {
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * verticalSpread,
      z: (Math.random() - 0.5) * 12,
    };

    // Calculate base spiral position
    const x = Math.cos(spiralAngle) * radiusProgression + randomOffset.x;
    const z = Math.sin(spiralAngle) * radiusProgression + randomOffset.z;
    const y =
      Math.sin(spiralAngle * 0.3) * (verticalSpread * 0.3) + randomOffset.y;

    return [x, y, z] as [number, number, number];
  };

  // Create galaxies, one per category
  sortedCategories.forEach((category, i) => {
    const categoryPubs = publicationsByCategory[category];
    const color =
      categories[category as keyof typeof categories]?.color || "#888888";

    // Get position along spiral arm
    const [centerX, centerY, centerZ] = getSpiralPosition(i, numberOfGalaxies);

    // Position publications within the galaxy in a realistic spiral pattern
    categoryPubs.forEach((pub, index) => {
      const totalPubs = categoryPubs.length;
      const progressInGalaxy = index / totalPubs;

      // Create spiral arms within the galaxy
      const internalArms = 3;
      const armIndex = index % internalArms;
      const baseAngle = (armIndex / internalArms) * Math.PI * 2;

      // Logarithmic spiral within galaxy
      const pubRadius = 2 + progressInGalaxy * 8; // 2 to 10 units from center
      const spiralAngle = baseAngle + Math.log(pubRadius + 1) * 1.5;

      // Add random offset for natural look
      const randomAngleOffset = (Math.random() - 0.5) * 0.4;
      const randomRadiusOffset = (Math.random() - 0.5) * 1.5;
      const finalRadius = pubRadius + randomRadiusOffset;
      const finalAngle = spiralAngle + randomAngleOffset;

      // Add vertical displacement (thinner disk at edges, bulge at center)
      const verticalFactor = Math.exp(-finalRadius / 5); // Exponential falloff
      const verticalDisplacement =
        (Math.random() - 0.5) * 1.5 * (verticalFactor + 0.1);

      // Calculate final position relative to galaxy center
      pub.position = [
        centerX + finalRadius * Math.cos(finalAngle),
        centerY + verticalDisplacement,
        centerZ + finalRadius * Math.sin(finalAngle),
      ];
      pub.constellationId = `galaxy-${i}`;
    });

    constellations.push({
      id: `galaxy-${i}`,
      name: `${category} Research Cluster`,
      publications: categoryPubs,
      center: [centerX, centerY, centerZ],
      color,
      category,
    });
  });

  return constellations;
}
