const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'shangtech_website',
});

const insights = [
  {
    title: '2026 企业 AI 落地五大趋势',
    summary: '从大模型到 Agent，企业正在从「尝试 AI」转向「规模应用 AI」。',
    category: 'technology',
    status: 'published',
    author_name: '林哲',
    author_role: '首席技术官',
    author_avatar: 'LZ',
    sort_order: 1,
  },
  {
    title: '金融科技如何应对合规挑战',
    summary: '全球监管趋严背景下，技术如何帮助金融机构实现合规与创新的平衡。',
    category: 'industry',
    status: 'published',
    author_name: '王佳',
    author_role: '行业研究总监',
    author_avatar: 'WJ',
    sort_order: 2,
  },
  {
    title: '数字化转型中的组织韧性',
    summary: '技术投资之外，企业更需要建立适应快速变化的组织文化与人才体系。',
    category: 'leadership',
    status: 'published',
    author_name: '陈明',
    author_role: '高级副总裁',
    author_avatar: 'CM',
    sort_order: 3,
  },
  {
    title: '混合云架构的最佳实践',
    summary: '如何设计兼具灵活性、安全性和成本效益的混合云架构。',
    category: 'technology',
    status: 'published',
    author_name: '艾琳',
    author_role: '云架构负责人',
    author_avatar: 'AL',
    sort_order: 4,
  },
  {
    title: '零售业的新质生产力',
    summary: '数据与 AI 正在重塑零售价值链，从供应链到客户体验的全面变革。',
    category: 'industry',
    status: 'published',
    author_name: '大卫',
    author_role: '零售解决方案负责人',
    author_avatar: 'DW',
    sort_order: 5,
  },
  {
    title: '从 CIO 到 CEO 的数字化领导力',
    summary: '技术领导者如何成为企业战略的推动者，而不仅仅是成本的控制者。',
    category: 'leadership',
    status: 'published',
    author_name: '苏珊',
    author_role: '首席战略官',
    author_avatar: 'SR',
    sort_order: 6,
  },
];

async function main() {
  await client.connect();

  for (const insight of insights) {
    const res = await client.query(
      `INSERT INTO insights (title, summary, category, status, author_name, author_role, author_avatar, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [
        insight.title,
        insight.summary,
        insight.category,
        insight.status,
        insight.author_name,
        insight.author_role,
        insight.author_avatar,
        insight.sort_order,
      ],
    );
    if (res.rowCount > 0) {
      console.log(`Inserted insight: ${insight.title}`);
    }
  }

  console.log('Insights seeded successfully');
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
