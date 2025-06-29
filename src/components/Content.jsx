import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import Typography from '@mui/material/Typography';
import { SitemarkIcon } from './CustomIcons';
import { GradientOutlined, MessageSharp, PhoneCallback } from '@mui/icons-material';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Human Resource',
    description:
      'Manage staff records, training, and performance with ease, ensuring a productive and motivated workforce.',
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Finance & Accounting',
    description:
      'Automate payroll, invoicing, and manage budgets with precision, ensuring financial stability and growth.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Operations',
    description:
      'Track inventory and manage stock levels, ensuring you have the right products at the right time.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Sales & Marketing',
    description:
      'Monitor leads, manage mailing lists, and track sales pipelines, ensuring you never miss an opportunity.',
  },
  {
    icon: <PhoneCallback sx={{ color: 'text.secondary' }} />,
    title: 'Customer Service',
    description:
      'Record and track customer inquiries, complaints, and feedback, ensuring you deliver exceptional service.',
  },
  {
    icon: <GradientOutlined sx={{ color: 'text.secondary' }} />,
    title: 'Project Management',
    description:
      'Assign tasks and track project progress, ensuring deadlines are met and projects are delivered on time.',
  },
  {
    icon: <MessageSharp sx={{ color: 'text.secondary' }} />,
    title: 'Messaging',
    description:
      'Internal and external messaging features for communication with staff and customers.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SitemarkIcon />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}