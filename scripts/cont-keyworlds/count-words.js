const fs = require('fs');
const path = require('path');

const stopWords = new Set([
  // 🇺🇸 English stop words
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with',
  'you', 'your', 'yours', 'yourself', 'yourselves', 'applications', 's', '1', '2', '3', '4', '5',
  '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35',
  '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
  '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65',
  '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
  '0', '000', '1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', 'environment', 'success', 'understanding', 'pro', 'experience', 'team', 'teamwork', 'work', 'working'
  , 'workplace', 'workspaces', 'workstation', 'workstations', 'workspace', 'workspaces', 'workstation', 'workstations', 'workplace', 'workplaces', 'team', 'teams', 'teammate', 'teammates',
  'technology', 'technologies', 'technology', 'programming', 'programmer', 'programmers', 'programming', 'programming', 'programmer', 'programmers', 'developer', 'developers',
  // 🇧🇷 Portuguese stop words
  'a', 'à', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as', 'até', 'com',
  'como', 'da', 'das', 'de', 'dela', 'dele', 'deles', 'demais', 'depois', 'do', 'dos', 'e', 'é',
  'ela', 'elas', 'ele', 'eles', 'em', 'entre', 'era', 'eram', 'essa', 'essas', 'esse', 'esses',
  'esta', 'está', 'estão', 'estas', 'este', 'estes', 'eu', 'faz', 'isso', 'isto', 'já', 'lhe',
  'lhes', 'mais', 'mas', 'me', 'mesmo', 'meu', 'meus', 'minha', 'minhas', 'na', 'nas', 'não', 'nem',
  'no', 'nos', 'nós', 'nossa', 'nossas', 'nosso', 'nossos', 'o', 'os', 'ou', 'para', 'pela',
  'pelas', 'pelo', 'pelos', 'por', 'qual', 'quando', 'que', 'quem', 'se', 'sem', 'seu', 'seus',
  'só', 'sua', 'suas', 'também', 'te', 'tem', 'têm', 'temos', 'tenho', 'tive', 'tivemos', 'tu',
  'tua', 'tuas', 'um', 'uma', 'você', 'vocês', 'vos', 'foi', 'ser', 'sou', 'são', 'era', 'vai', 'vão',
  'deve', 'devem', 'times', 'time', 'trabalho', 'trabalhar', 'trabalhando', 'trabalhou', 'cultura','conhecimento', 'diversidade', 'diversidade', 'inclusão', 'inclusão', 'inclusivo', 'inclusivos',
  'inclusiva', 'inclusivas', 'inclusividade', 'inclusividades', 'inclusividade', 'inclusividades', 'diversidade', 'diversidades', 'diversidade', 'diversidades',
  'somos', 'pros', 'vida', 'experiencia', 'desenvolvimento', 'desenvolvedor', 'desenvolvedores', 'desenvolvedora', 'desenvolvedoras', 'programador',
  'technologia', 'tecnologias', 'tecnologia', 'programação', 'programador', 'programadora', 'programadores', 'programadoras', 'engenheiro', 'engenheira',
]);

function countKeywords(inputPath, outputPath) {
  const inputFullPath = path.resolve(inputPath);
  if (!fs.existsSync(inputFullPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(inputFullPath, 'utf8');

  const wordCounts = {};

  const words = content
    .toLowerCase()
    .normalize("NFD")                       // Remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, ' ')
    .split(/\s+/)
    .filter(word => word && !stopWords.has(word));

  for (const word of words) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40);

  // Console output
  console.log('\n📊 Top 40 Keywords:\n');
  topWords.forEach(([word, count], i) => {
    console.log(`${String(i + 1).padStart(2)}. ${word} (${count})`);
  });

  // Markdown output
  const markdownOutput = [
    '# 📊 Top 40 Keywords from Job Descriptions',
    '',
    '| Rank | Keyword | Count |',
    '|------|---------|-------|',
    ...topWords.map(([word, count], i) =>
      `| ${i + 1} | ${word} | ${count} |`
    ),
    ''
  ].join('\n');

  fs.writeFileSync(outputPath, markdownOutput, 'utf8');
  console.log(`\n✅ Results written to ${outputPath}`);
}

countKeywords('input.md', 'output.md');
