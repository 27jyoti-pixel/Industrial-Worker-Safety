const avatarImages = import.meta.glob('../../assets/profile-avatars/*.png', { eager: true, query: '?url', import: 'default' });
const avatar = (id, displayLabel, gender, details) => ({
  id,
  displayLabel,
  gender,
  label: `${displayLabel} (${gender})`,
  image: avatarImages[`../../assets/profile-avatars/${id}.png`],
  ...details
});

export const AVATAR_GROUPS = [
  {
    id: 'field-operator',
    label: 'Field Worker / Operator',
    avatars: [
      avatar('field-worker-male', 'Field Worker', 'Male', { skin: '#e9ae80', hair: '#433126', shirt: '#163e66', helmet: '#f5f4ee', vest: '#ed7626' }),
      avatar('field-worker-female', 'Field Worker', 'Female', { skin: '#efbd91', hair: '#55362a', hairStyle: 'long', shirt: '#163e66', helmet: '#f5f4ee', vest: '#ed7626' }),
      avatar('plant-operator-male', 'Plant Operator', 'Male', { skin: '#d89b70', hair: '#33261f', shirt: '#244f7b', helmet: '#f4c02b', glasses: true }),
      avatar('plant-operator-female', 'Plant Operator', 'Female', { skin: '#f0ba8c', hair: '#4b2d22', hairStyle: 'long', shirt: '#244f7b', helmet: '#f4c02b', glasses: true })
    ]
  },
  {
    id: 'safety-inspection',
    label: 'Safety Officer / Inspector',
    avatars: [
      avatar('safety-inspector-male', 'Safety Inspector', 'Male', { skin: '#d99e74', hair: '#3b2a22', shirt: '#2b5272', helmet: '#f5f4ee', vest: '#d6dc56', clipboard: true }),
      avatar('safety-inspector-female', 'Safety Inspector', 'Female', { skin: '#f0bb91', hair: '#493027', hairStyle: 'long', shirt: '#2b5272', helmet: '#f5f4ee', vest: '#d6dc56', clipboard: true }),
      avatar('safety-officer-male', 'Safety Officer', 'Male', { skin: '#a96848', hair: '#292321', beard: true, shirt: '#183b61', helmet: '#f2bd27', vest: '#ee7626' }),
      avatar('safety-officer-female', 'Safety Officer', 'Female', { skin: '#e9b083', hair: '#472b24', hairStyle: 'long', shirt: '#183b61', helmet: '#f2bd27', vest: '#ee7626' })
    ]
  },
  {
    id: 'technical-maintenance',
    label: 'Technical / Maintenance',
    avatars: [
      avatar('maintenance-technician-male', 'Maintenance Technician', 'Male', { skin: '#c7835c', hair: '#30231f', shirt: '#20507c', helmet: '#efeee9', tool: true }),
      avatar('maintenance-technician-female', 'Maintenance Technician', 'Female', { skin: '#eab48c', hair: '#3c2823', hairStyle: 'long', shirt: '#20507c', helmet: '#efeee9', tool: true }),
      avatar('plant-technician-male', 'Plant Technician', 'Male', { skin: '#e4a778', hair: '#382920', shirt: '#24517c', glasses: true, badge: true }),
      avatar('plant-technician-female', 'Plant Technician', 'Female', { skin: '#efbc91', hair: '#472b24', hairStyle: 'long', shirt: '#24517c', glasses: true, badge: true })
    ]
  },
  {
    id: 'engineer',
    label: 'Engineer',
    avatars: [
      avatar('engineer-male', 'Engineer', 'Male', { skin: '#e6ad82', hair: '#362820', shirt: '#f1f1ed', jacket: '#233e58', helmet: '#f5f4ee', tie: true }),
      avatar('engineer-female', 'Engineer', 'Female', { skin: '#edbc91', hair: '#4a2f27', hairStyle: 'long', shirt: '#1d5279', helmet: '#f5f4ee', vest: '#eb7627' }),
      avatar('process-engineer-male', 'Process Engineer', 'Male', { skin: '#d99e74', hair: '#2e2724', shirt: '#28547c', glasses: true, helmet: '#f4f2ed', badge: true }),
      avatar('process-engineer-female', 'Process Engineer', 'Female', { skin: '#efbd93', hair: '#523329', hairStyle: 'long', shirt: '#28547c', helmet: '#f4f2ed', glasses: true, badge: true })
    ]
  },
  {
    id: 'administrative-management',
    label: 'Administrative / Management',
    avatars: [
      avatar('supervisor-male', 'Supervisor', 'Male', { skin: '#ecc09a', hair: '#372820', shirt: '#d9e4ea', badge: true }),
      avatar('supervisor-female', 'Supervisor', 'Female', { skin: '#f0c49c', hair: '#55392e', hairStyle: 'long', shirt: '#d9e4ea', badge: true }),
      avatar('manager-male', 'Manager', 'Male', { skin: '#ce8e69', hair: '#292321', beard: true, shirt: '#1c344c', tie: true, badge: true }),
      avatar('manager-female', 'Manager', 'Female', { skin: '#edbd93', hair: '#4e3128', hairStyle: 'long', shirt: '#d8e2e9', badge: true })
    ]
  },
  {
    id: 'additional-options',
    label: 'Additional Options',
    avatars: [
      avatar('office-staff-male', 'Office Staff', 'Male', { skin: '#e5ad81', hair: '#302720', shirt: '#dbe5eb', glasses: true, badge: true }),
      avatar('office-staff-female', 'Office Staff', 'Female', { skin: '#edbe95', hair: '#4c3027', hairStyle: 'long', shirt: '#dbe5eb', glasses: true, badge: true }),
      avatar('logistics-worker-male', 'Logistics Worker', 'Male', { skin: '#ba7b58', hair: '#30231f', beard: true, shirt: '#173e67', cap: '#285b91', vest: '#ed7626' }),
      avatar('logistics-worker-female', 'Logistics Worker', 'Female', { skin: '#e6ae84', hair: '#482e26', hairStyle: 'long', shirt: '#173e67', cap: '#285b91', vest: '#ed7626' })
    ]
  }
];

export const PROFILE_AVATARS = AVATAR_GROUPS.flatMap((group) => group.avatars);

const LEGACY_AVATAR_ALIASES = {
  Worker: {
    'worker-01': 'field-worker-male', 'worker-02': 'field-worker-female',
    'worker-03': 'plant-operator-male', 'worker-04': 'plant-operator-female',
    'worker-05': 'maintenance-technician-male', 'worker-06': 'maintenance-technician-female',
    'worker-07': 'plant-technician-male', 'worker-08': 'plant-technician-female'
  },
  'Factory Admin': {
    'worker-01': 'supervisor-male', 'worker-02': 'supervisor-female',
    'worker-03': 'manager-male', 'worker-04': 'manager-female',
    'worker-05': 'office-staff-male', 'worker-06': 'office-staff-female',
    'worker-07': 'logistics-worker-male', 'worker-08': 'logistics-worker-female'
  },
  'Government Officer': {
    'worker-01': 'safety-inspector-male', 'worker-02': 'safety-inspector-female',
    'worker-03': 'safety-officer-male', 'worker-04': 'safety-officer-female',
    'worker-05': 'engineer-male', 'worker-06': 'engineer-female',
    'worker-07': 'process-engineer-male', 'worker-08': 'process-engineer-female'
  },
  'Super Admin': {
    'worker-01': 'engineer-male', 'worker-02': 'engineer-female',
    'worker-03': 'process-engineer-male', 'worker-04': 'process-engineer-female',
    'worker-05': 'manager-male', 'worker-06': 'manager-female',
    'worker-07': 'office-staff-male', 'worker-08': 'office-staff-female'
  }
};

export const resolveProfileAvatarId = (avatarId, role) => {
  if (PROFILE_AVATARS.some((item) => item.id === avatarId)) return avatarId;
  return LEGACY_AVATAR_ALIASES[role]?.[avatarId] || null;
};
