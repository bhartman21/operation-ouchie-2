export interface BodyRegionSubsystem {
    system: string;
    subSystem?: string;
}

export interface BodyRegion {
    id: string;
    label: string;
    view: 'exterior' | 'interior';
    subsystems: BodyRegionSubsystem[];
}

export const BODY_REGIONS: BodyRegion[] = [
    // --- EXTERIOR REGIONS ---
    {
        id: 'head-skull',
        label: 'Skull / Face',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'The Skull' },
            { system: 'Respiratory System', subSystem: 'Nose and Throat' },
            { system: 'Dental and Oral', subSystem: 'Dental and Oral Conditions' },
            { system: 'Other Sense Organs', subSystem: 'Smell and Taste' },
        ]
    },
    {
        id: 'eyes',
        label: 'Eyes',
        view: 'exterior',
        subsystems: [
            { system: 'The Eye', subSystem: 'Diseases of the Eye' },
            { system: 'The Eye', subSystem: 'Impairment of Central Visual Acuity' },
            { system: 'The Eye', subSystem: 'Impairment of Field Vision' },
            { system: 'The Eye', subSystem: 'Impairment of Muscle Function' },
        ]
    },
    {
        id: 'ears',
        label: 'Ears',
        view: 'exterior',
        subsystems: [
            { system: 'The Ear', subSystem: 'Diseases of the Ear' },
        ]
    },
    {
        id: 'neck',
        label: 'Neck',
        view: 'exterior',
        subsystems: [
            { system: 'Muscle Injuries', subSystem: 'Torso and Neck' },
            { system: 'Neurological', subSystem: 'Cranial Nerves' },
        ]
    },
    {
        id: 'shoulder-arm',
        label: 'Shoulder / Arm',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Shoulder and Arm' },
            { system: 'Musculoskeletal System', subSystem: 'Elbow and Forearm' },
            { system: 'Muscle Injuries', subSystem: 'Shoulder Girdle and Arm' },
        ]
    },
    {
        id: 'wrist-hand',
        label: 'Wrist / Hand',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Wrist' },
            { system: 'Musculoskeletal System', subSystem: 'Limitation of Motion (Hand)' },
            { system: 'Muscle Injuries', subSystem: 'Forearm and Hand' },
        ]
    },
    {
        id: 'chest-torso',
        label: 'Chest / Torso',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'The Ribs' },
            { system: 'Muscle Injuries', subSystem: 'Torso and Neck' },
        ]
    },
    {
        id: 'spine-back',
        label: 'Spine / Back',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Spine' },
            { system: 'Musculoskeletal System', subSystem: 'The Coccyx' },
        ]
    },
    {
        id: 'hip-pelvis',
        label: 'Hip / Pelvis',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Hip and Thigh' },
            { system: 'Muscle Injuries', subSystem: 'Pelvic Girdle and Thigh' },
        ]
    },
    {
        id: 'knee-leg',
        label: 'Knee / Leg',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Knee and Leg' },
            { system: 'Muscle Injuries', subSystem: 'Foot and Leg' },
        ]
    },
    {
        id: 'foot-ankle',
        label: 'Foot / Ankle',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'The Foot' },
            { system: 'Musculoskeletal System', subSystem: 'Ankle' },
        ]
    },
    {
        id: 'skin',
        label: 'Skin',
        view: 'exterior',
        subsystems: [
            { system: 'The Skin', subSystem: 'The Skin' },
        ]
    },

    // --- INTERIOR REGIONS ---
    {
        id: 'brain',
        label: 'Brain',
        view: 'interior',
        subsystems: [
            { system: 'Mental Disorders', subSystem: 'Mental Disorders' },
            { system: 'Neurological', subSystem: 'Organic Diseases of CNS' },
            { system: 'Neurological', subSystem: 'The Epilepsies' },
            { system: 'Neurological', subSystem: 'Brain, New Growth of' },
            { system: 'Neurological', subSystem: 'Miscellaneous Diseases' },
        ]
    },
    {
        id: 'spinal-cord',
        label: 'Spinal Cord',
        view: 'interior',
        subsystems: [
            { system: 'Neurological', subSystem: 'Spinal Cord, New Growths' },
            { system: 'Neurological', subSystem: 'Peripheral Nerves' },
        ]
    },
    {
        id: 'heart',
        label: 'Heart',
        view: 'interior',
        subsystems: [
            { system: 'Cardiovascular System', subSystem: 'Diseases of the Heart' },
        ]
    },
    {
        id: 'arteries-veins',
        label: 'Arteries / Veins',
        view: 'interior',
        subsystems: [
            { system: 'Cardiovascular System', subSystem: 'Diseases of the Arteries and Veins' },
        ]
    },
    {
        id: 'lungs',
        label: 'Lungs',
        view: 'interior',
        subsystems: [
            { system: 'Respiratory System', subSystem: 'Bacterial Infections of the Lung' },
            { system: 'Respiratory System', subSystem: 'Interstitial Lung Disease' },
            { system: 'Respiratory System', subSystem: 'Mycotic Lung Disease' },
            { system: 'Respiratory System', subSystem: 'Nontuberculous Diseases' },
            { system: 'Respiratory System', subSystem: 'Restrictive Lung Disease' },
            { system: 'Respiratory System', subSystem: 'Trachea and Bronchi' },
            { system: 'Respiratory System', subSystem: 'Tuberculosis' },
        ]
    },
    {
        id: 'liver',
        label: 'Liver',
        view: 'interior',
        subsystems: [
            { system: 'Digestive System', subSystem: 'Liver and Biliary' },
        ]
    },
    {
        id: 'digestive',
        label: 'Digestive System',
        view: 'interior',
        subsystems: [
            { system: 'Digestive System', subSystem: 'Stomach and Duodenum' },
            { system: 'Digestive System', subSystem: 'Intestine' },
            { system: 'Digestive System', subSystem: 'Esophagus' },
            { system: 'Digestive System', subSystem: 'Rectum and Anus' },
            { system: 'Digestive System', subSystem: 'Pancreas' },
            { system: 'Digestive System', subSystem: 'Peritoneum' },
            { system: 'Digestive System', subSystem: 'Visceroptosis' },
            { system: 'Digestive System', subSystem: 'Mouth, Lips, Tongue' },
            { system: 'Digestive System', subSystem: 'Hernia' },
        ]
    },
    {
        id: 'kidneys-bladder',
        label: 'Kidneys / Bladder',
        view: 'interior',
        subsystems: [
            { system: 'Genitourinary System', subSystem: 'Kidney' },
            { system: 'Genitourinary System', subSystem: 'Ureter' },
            { system: 'Genitourinary System', subSystem: 'Urethra' },
            { system: 'Genitourinary System', subSystem: 'Bladder' },
        ]
    },
    {
        id: 'reproductive',
        label: 'Reproductive',
        view: 'interior',
        subsystems: [
            { system: 'Genitourinary System', subSystem: 'Male Reproductive Organ' },
            { system: 'Gynecological/Breast', subSystem: 'Female Reproductive Organ' },
            { system: 'Gynecological/Breast', subSystem: 'Breast' },
        ]
    },
    {
        id: 'endocrine',
        label: 'Endocrine',
        view: 'interior',
        subsystems: [
            { system: 'Endocrine System', subSystem: 'Endocrine System' },
        ]
    },
    {
        id: 'lymphatic-immune',
        label: 'Lymphatic / Immune',
        view: 'interior',
        subsystems: [
            { system: 'Hemic and Lymphatic', subSystem: 'Hemic and Lymphatic' },
            { system: 'Infectious Diseases/Immune Disorders', subSystem: 'Infectious Diseases' },
        ]
    },
];
