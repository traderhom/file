// Script d'initialisation des pages de base pour MongoDB
const mongoose = require('mongoose');
const Page = require('../models/Page');

const pages = [
  {
    title: 'Accueil',
    slug: 'accueil',
    content: '# Bienvenue sur la page d\'accueil',
    metaDescription: 'Page d\'accueil du site ESST',
    status: 'published',
    lastModified: new Date().toISOString(),
    author: 'admin'
  },
  {
    title: 'Formation',
    slug: 'formation',
    content: '# Nos formations',
    metaDescription: 'Découvrez nos formations',
    status: 'published',
    lastModified: new Date().toISOString(),
    author: 'admin'
  },
  {
    title: 'Recherche',
    slug: 'recherche',
    content: '# Recherche',
    metaDescription: 'Nos activités de recherche',
    status: 'published',
    lastModified: new Date().toISOString(),
    author: 'admin'
  },
  {
    title: 'Actualités',
    slug: 'actualites',
    content: '# Actualités',
    metaDescription: 'Les dernières actualités',
    status: 'published',
    lastModified: new Date().toISOString(),
    author: 'admin'
  },
  {
    title: 'Newsletter',
    slug: 'newsletter',
    content: '# Newsletter',
    metaDescription: 'Inscrivez-vous à la newsletter',
    status: 'published',
    lastModified: new Date().toISOString(),
    author: 'admin'
  },
  {
    title: 'Cours',
    slug: 'cours',
    content: '# Nos cours',
    metaDescription: 'Liste des cours',
    status: 'published',
    lastModified: new Date().toISOString(),
    author: 'admin'
  },
  {
    title: 'Projets',
    slug: 'projets',
    content: '# Projets',
    metaDescription: 'Nos projets',
    status: 'published',
    lastModified: new Date().toISOString(),
    author: 'admin'
  }
];

async function main() {
  await mongoose.connect('mongodb://localhost:27017/esst', { useNewUrlParser: true, useUnifiedTopology: true });
  await Page.deleteMany({ slug: { $in: pages.map(p => p.slug) } });
  await Page.insertMany(pages);
  console.log('Pages de base insérées !');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
