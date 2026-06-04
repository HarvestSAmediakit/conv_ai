export interface ArticleSection {
  id: string;
  heading: string;
  content: string;
}

export interface MagazineArticle {
  id: string;
  title: string;
  author: string;
  category: string;
  sections: ArticleSection[];
}

/**
 * Simulates loading and parsing a publication issue.
 * In production, this reads from a Markdown repository or a headless CMS database.
 */
export async function loadMagazineContent(magazineId: string): Promise<MagazineArticle[]> {
  // Mock data representing parsed publication text for Harvest SA
  return [
    {
      id: "art_sustainable_2026",
      title: "The Shift to Regenerative Agriculture Techniques",
      author: "Terrence Malick",
      category: "Cover Story",
      sections: [
        {
          id: "sec_intro",
          heading: "Introduction",
          content: "By 2026, autonomous farming isn't just a luxury; it's the baseline for survival in a changing climate. Traditional monoculture systems are giving way to biodynamic networks."
        },
        {
          id: "sec_soil",
          heading: "The Soil Carbon Metric",
          content: "The primary indicator of ecosystem recovery is the soil organic carbon (SOC) index. Increasing SOC by even 1% drastically improves moisture retention and structural biological diversity."
        },
        {
          id: "sec_automation",
          heading: "Autonomous Integration",
          content: "Deploying localized sensor matrices allows autonomous irrigation grids to distribute resources precisely where microbial activity requires it most, preventing nitrogen runoff."
        }
      ]
    }
  ];
}
