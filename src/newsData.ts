export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  category: 'Healthcare' | 'Data Center' | 'Infrastructure' | 'Life Sciences' | 'Technology';
  image: string;
  overview: string;
  client?: string;
  location: string;
  value?: string;
  scope: string[];
  innovations: string[];
  timeline: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: 'dpr-data-center-campus-2026',
    title: "DPR Construction Breaks Ground on Major Data Center Campus in Northern Virginia",
    date: "Feb 15, 2026",
    category: 'Data Center',
    image: 'https://lh3.googleusercontent.com/d/19hD96smWlnmfXLUzFDrRJlq48u8AsIpy',
    overview: "DPR Construction has officially commenced work on a state-of-the-art data center campus in Northern Virginia. This multi-phase project aims to deliver over 200MW of capacity to meet the growing demand for cloud services and AI processing.",
    client: "Global Cloud Provider",
    location: "Ashburn, Virginia",
    value: "$1.2 Billion",
    scope: [
      "Site development and utility infrastructure",
      "Construction of four 50MW data halls",
      "Installation of advanced liquid cooling systems",
      "Redundant power backup systems (UPS and Generators)",
      "High-security perimeter and access control"
    ],
    innovations: [
      "BIM-coordinated MEP systems",
      "Prefabricated electrical rooms",
      "AI-driven site safety monitoring",
      "Low-carbon concrete foundations"
    ],
    timeline: "2026 - 2028"
  },
  {
    slug: 'healthcare-patient-tower-topping-out',
    title: "Advancing Healthcare: New Patient Tower Reaches Topping Out Milestone",
    date: "Jan 28, 2026",
    category: 'Healthcare',
    image: 'https://lh3.googleusercontent.com/d/1RaaymeKAFsyRJKtcsvC5mtpAFmLLq8GE',
    overview: "The new 12-story patient tower at the University Medical Center has reached its highest point. This milestone marks a significant step toward completing the region's most advanced critical care facility.",
    client: "University Medical Center",
    location: "San Francisco, California",
    value: "$450 Million",
    scope: [
      "12-story structural steel frame",
      "250 private patient rooms",
      "15 advanced surgical suites",
      "Integrated emergency department expansion",
      "Healing gardens and public spaces"
    ],
    innovations: [
      "Modular bathroom pods",
      "Virtual Reality (VR) design reviews with medical staff",
      "Lean construction scheduling",
      "LEED Gold certification targets"
    ],
    timeline: "2024 - 2027"
  },
  {
    slug: 'technical-builder-life-sciences',
    title: "DPR Named #1 Technical Builder in the U.S. for Life Sciences",
    date: "Jan 10, 2026",
    category: 'Life Sciences',
    image: 'https://lh3.googleusercontent.com/d/1S6peMhwIPUdM3TfDpVpXHnxdEu6DHIad',
    overview: "For the third consecutive year, DPR Construction has been recognized as the leading technical builder for the life sciences sector. This recognition highlights our expertise in delivering complex laboratory and biotech manufacturing facilities.",
    location: "National Recognition",
    scope: [
      "BSL-3 and BSL-4 laboratory construction",
      "cGMP manufacturing facility delivery",
      "Vivarium and cleanroom specialized systems",
      "Complex HVAC and filtration integration"
    ],
    innovations: [
      "Digital Twin for facility management",
      "Advanced cleanroom pre-certification",
      "Integrated project delivery (IPD) models"
    ],
    timeline: "Ongoing Excellence"
  },
  {
    slug: 'prefabrication-semiconductor-facility',
    title: "Innovative Prefabrication Techniques Accelerate Semiconductor Facility Construction",
    date: "Dec 15, 2025",
    category: 'Technology',
    image: 'https://lh3.googleusercontent.com/d/1AzHqGTV6H8IxsZCUr-9Ct3-C_2BIGyUU',
    overview: "By utilizing off-site prefabrication for over 60% of the MEP systems, DPR has significantly reduced the construction timeline for a major semiconductor fabrication plant.",
    client: "Leading Semiconductor Manufacturer",
    location: "Phoenix, Arizona",
    value: "$2.5 Billion",
    scope: [
      "Cleanroom envelope construction",
      "High-purity piping systems",
      "Specialized gas and chemical delivery systems",
      "Vibration-isolated structural foundations"
    ],
    innovations: [
      "Multi-trade prefabrication racks",
      "Robotic layout and installation",
      "Real-time supply chain tracking",
      "Advanced 4D scheduling"
    ],
    timeline: "2025 - 2027"
  }
];
