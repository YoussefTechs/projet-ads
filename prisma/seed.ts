/**
 * Seed Atlas — données d'exemple réalistes (continents → pays → villes →
 * lieux/hôtels/restaurants), catégories, auteurs, articles et commentaires.
 *
 * Lancer : `npm run db:seed`
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/atlas-${seed}/${w}/${h}`;

const climateSample = {
  months: [
    { m: "Jan", t: 7, rain: 50 },
    { m: "Fév", t: 8, rain: 45 },
    { m: "Mar", t: 12, rain: 48 },
    { m: "Avr", t: 15, rain: 50 },
    { m: "Mai", t: 19, rain: 55 },
    { m: "Juin", t: 22, rain: 50 },
    { m: "Juil", t: 25, rain: 40 },
    { m: "Août", t: 25, rain: 42 },
    { m: "Sep", t: 21, rain: 48 },
    { m: "Oct", t: 16, rain: 60 },
    { m: "Nov", t: 11, rain: 58 },
    { m: "Déc", t: 8, rain: 55 },
  ],
};

async function main() {
  console.log("🌱 Nettoyage…");
  await prisma.comment.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.place.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.city.deleteMany();
  await prisma.region.deleteMany();
  await prisma.country.deleteMany();
  await prisma.continent.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.user.deleteMany();

  // ───────────── Utilisateurs ─────────────
  console.log("👤 Utilisateurs…");
  const admin = await prisma.user.create({
    data: {
      name: "Admin Atlas",
      email: "admin@atlas.test",
      passwordHash: await bcrypt.hash("Admin1234", 12),
      role: "ADMIN",
      slug: "admin-atlas",
      bio: "Fondateur d'Atlas, passionné de voyage depuis 15 ans.",
      expertise: "Rédacteur en chef",
      image: img("author-admin", 200, 200),
    },
  });
  const author = await prisma.user.create({
    data: {
      name: "Marie Dubois",
      email: "marie@atlas.test",
      passwordHash: await bcrypt.hash("Marie1234", 12),
      role: "EDITOR",
      slug: "marie-dubois",
      bio: "Grande voyageuse, Marie a parcouru plus de 40 pays.",
      expertise: "Spécialiste Asie & Europe",
      image: img("author-marie", 200, 200),
    },
  });
  await prisma.user.create({
    data: {
      name: "Utilisateur Démo",
      email: "user@atlas.test",
      passwordHash: await bcrypt.hash("User1234", 12),
      role: "USER",
    },
  });

  // ───────────── Continents ─────────────
  console.log("🌍 Continents…");
  const continentData = [
    { name: "Europe", slug: "europe" },
    { name: "Asie", slug: "asie" },
    { name: "Amérique du Nord", slug: "amerique-du-nord" },
    { name: "Amérique du Sud", slug: "amerique-du-sud" },
    { name: "Afrique", slug: "afrique" },
    { name: "Océanie", slug: "oceanie" },
  ];
  const continents: Record<string, string> = {};
  for (const c of continentData) {
    const created = await prisma.continent.create({
      data: {
        name: c.name,
        slug: c.slug,
        summary: `Découvrez les plus belles destinations d'${c.name}.`,
        description: `L'${c.name} regorge de destinations exceptionnelles, de villes mythiques et de paysages variés. Explorez nos guides pour préparer votre voyage.`,
        heroImage: img(`continent-${c.slug}`, 1600, 900),
      },
    });
    continents[c.slug] = created.id;
  }

  // ───────────── Catégories ─────────────
  console.log("🏷️  Catégories…");
  const categoryData = [
    { name: "Voyage en famille", slug: "voyage-en-famille", kind: "STYLE" },
    { name: "Voyage en couple", slug: "voyage-en-couple", kind: "STYLE" },
    { name: "Petit budget", slug: "petit-budget", kind: "BUDGET" },
    { name: "Aventure", slug: "aventure", kind: "STYLE" },
    { name: "Plages & îles", slug: "plages-et-iles", kind: "TYPE" },
    { name: "City-break", slug: "city-break", kind: "TYPE" },
    { name: "Culture & patrimoine", slug: "culture-patrimoine", kind: "STYLE" },
    { name: "Gastronomie", slug: "gastronomie", kind: "STYLE" },
  ] as const;
  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        kind: cat.kind,
        heroImage: img(`cat-${cat.slug}`, 800, 1000),
        intro: `Nos meilleures idées pour un voyage « ${cat.name.toLowerCase()} » : destinations triées sur le volet et conseils pratiques.`,
        description: `Envie d'un voyage ${cat.name.toLowerCase()} ? Retrouvez ici nos destinations recommandées et nos guides dédiés.`,
      },
    });
    categories[cat.slug] = created.id;
  }

  // ───────────── Pays & villes ─────────────
  console.log("🏙️  Pays, villes, lieux…");

  type CityInput = {
    name: string;
    slug: string;
    rating: number;
    featured?: boolean;
    lat: number;
    lng: number;
    places: { name: string; slug: string; type: string; rating: number }[];
    categories?: string[];
  };
  type CountryInput = {
    name: string;
    slug: string;
    continent: string;
    capital: string;
    currency: string;
    languages: string[];
    flagEmoji: string;
    budget: number;
    rating: number;
    featured?: boolean;
    bestSeason: string;
    cities: CityInput[];
    categories?: string[];
  };

  const data: CountryInput[] = [
    {
      name: "France",
      slug: "france",
      continent: "europe",
      capital: "Paris",
      currency: "Euro (€)",
      languages: ["Français"],
      flagEmoji: "🇫🇷",
      budget: 90,
      rating: 4.8,
      featured: true,
      bestSeason: "Avril à octobre",
      categories: ["culture-patrimoine", "gastronomie", "voyage-en-couple"],
      cities: [
        {
          name: "Paris",
          slug: "paris",
          rating: 4.8,
          featured: true,
          lat: 48.8566,
          lng: 2.3522,
          categories: ["voyage-en-couple", "culture-patrimoine", "city-break"],
          places: [
            { name: "Tour Eiffel", slug: "tour-eiffel", type: "MONUMENT", rating: 4.7 },
            { name: "Musée du Louvre", slug: "louvre", type: "MUSEUM", rating: 4.8 },
            { name: "Cathédrale Notre-Dame", slug: "notre-dame", type: "RELIGIOUS", rating: 4.7 },
            { name: "Montmartre", slug: "montmartre", type: "HISTORIC", rating: 4.6 },
          ],
        },
        {
          name: "Lyon",
          slug: "lyon",
          rating: 4.5,
          lat: 45.764,
          lng: 4.8357,
          categories: ["gastronomie", "city-break"],
          places: [
            { name: "Basilique de Fourvière", slug: "fourviere", type: "RELIGIOUS", rating: 4.6 },
            { name: "Vieux Lyon", slug: "vieux-lyon", type: "HISTORIC", rating: 4.5 },
          ],
        },
        {
          name: "Nice",
          slug: "nice",
          rating: 4.4,
          lat: 43.7102,
          lng: 7.262,
          categories: ["plages-et-iles", "voyage-en-couple"],
          places: [
            { name: "Promenade des Anglais", slug: "promenade-des-anglais", type: "VIEWPOINT", rating: 4.5 },
          ],
        },
      ],
    },
    {
      name: "Italie",
      slug: "italie",
      continent: "europe",
      capital: "Rome",
      currency: "Euro (€)",
      languages: ["Italien"],
      flagEmoji: "🇮🇹",
      budget: 85,
      rating: 4.7,
      featured: true,
      bestSeason: "Mai à septembre",
      categories: ["culture-patrimoine", "gastronomie"],
      cities: [
        {
          name: "Rome",
          slug: "rome",
          rating: 4.8,
          featured: true,
          lat: 41.9028,
          lng: 12.4964,
          categories: ["culture-patrimoine", "city-break"],
          places: [
            { name: "Colisée", slug: "colisee", type: "MONUMENT", rating: 4.8 },
            { name: "Fontaine de Trevi", slug: "fontaine-de-trevi", type: "MONUMENT", rating: 4.7 },
            { name: "Vatican", slug: "vatican", type: "RELIGIOUS", rating: 4.8 },
          ],
        },
        {
          name: "Venise",
          slug: "venise",
          rating: 4.6,
          featured: true,
          lat: 45.4408,
          lng: 12.3155,
          categories: ["voyage-en-couple"],
          places: [
            { name: "Place Saint-Marc", slug: "place-saint-marc", type: "HISTORIC", rating: 4.7 },
            { name: "Pont du Rialto", slug: "pont-du-rialto", type: "MONUMENT", rating: 4.6 },
          ],
        },
      ],
    },
    {
      name: "Espagne",
      slug: "espagne",
      continent: "europe",
      capital: "Madrid",
      currency: "Euro (€)",
      languages: ["Espagnol"],
      flagEmoji: "🇪🇸",
      budget: 75,
      rating: 4.6,
      featured: true,
      bestSeason: "Mai à octobre",
      categories: ["plages-et-iles", "gastronomie"],
      cities: [
        {
          name: "Barcelone",
          slug: "barcelone",
          rating: 4.7,
          featured: true,
          lat: 41.3851,
          lng: 2.1734,
          categories: ["city-break", "culture-patrimoine"],
          places: [
            { name: "Sagrada Família", slug: "sagrada-familia", type: "RELIGIOUS", rating: 4.8 },
            { name: "Parc Güell", slug: "parc-guell", type: "PARK", rating: 4.6 },
          ],
        },
        {
          name: "Séville",
          slug: "seville",
          rating: 4.5,
          lat: 37.3891,
          lng: -5.9845,
          categories: ["culture-patrimoine"],
          places: [
            { name: "Alcázar", slug: "alcazar", type: "HISTORIC", rating: 4.7 },
          ],
        },
      ],
    },
    {
      name: "Japon",
      slug: "japon",
      continent: "asie",
      capital: "Tokyo",
      currency: "Yen (¥)",
      languages: ["Japonais"],
      flagEmoji: "🇯🇵",
      budget: 110,
      rating: 4.9,
      featured: true,
      bestSeason: "Mars-avril & octobre-novembre",
      categories: ["culture-patrimoine", "aventure", "gastronomie"],
      cities: [
        {
          name: "Tokyo",
          slug: "tokyo",
          rating: 4.8,
          featured: true,
          lat: 35.6762,
          lng: 139.6503,
          categories: ["city-break", "gastronomie"],
          places: [
            { name: "Temple Senso-ji", slug: "senso-ji", type: "RELIGIOUS", rating: 4.7 },
            { name: "Shibuya Crossing", slug: "shibuya", type: "VIEWPOINT", rating: 4.6 },
            { name: "Tour de Tokyo", slug: "tour-de-tokyo", type: "MONUMENT", rating: 4.5 },
          ],
        },
        {
          name: "Kyoto",
          slug: "kyoto",
          rating: 4.9,
          featured: true,
          lat: 35.0116,
          lng: 135.7681,
          categories: ["culture-patrimoine", "voyage-en-couple"],
          places: [
            { name: "Fushimi Inari", slug: "fushimi-inari", type: "RELIGIOUS", rating: 4.9 },
            { name: "Pavillon d'or", slug: "kinkaku-ji", type: "RELIGIOUS", rating: 4.8 },
          ],
        },
      ],
    },
    {
      name: "Thaïlande",
      slug: "thailande",
      continent: "asie",
      capital: "Bangkok",
      currency: "Baht (฿)",
      languages: ["Thaï"],
      flagEmoji: "🇹🇭",
      budget: 45,
      rating: 4.6,
      featured: true,
      bestSeason: "Novembre à mars",
      categories: ["plages-et-iles", "petit-budget", "aventure"],
      cities: [
        {
          name: "Bangkok",
          slug: "bangkok",
          rating: 4.5,
          featured: true,
          lat: 13.7563,
          lng: 100.5018,
          categories: ["city-break", "petit-budget"],
          places: [
            { name: "Grand Palais", slug: "grand-palais", type: "HISTORIC", rating: 4.6 },
            { name: "Wat Arun", slug: "wat-arun", type: "RELIGIOUS", rating: 4.6 },
          ],
        },
        {
          name: "Chiang Mai",
          slug: "chiang-mai",
          rating: 4.6,
          lat: 18.7883,
          lng: 98.9853,
          categories: ["aventure", "petit-budget"],
          places: [
            { name: "Doi Suthep", slug: "doi-suthep", type: "RELIGIOUS", rating: 4.7 },
          ],
        },
      ],
    },
    {
      name: "États-Unis",
      slug: "etats-unis",
      continent: "amerique-du-nord",
      capital: "Washington",
      currency: "Dollar ($)",
      languages: ["Anglais"],
      flagEmoji: "🇺🇸",
      budget: 130,
      rating: 4.5,
      featured: true,
      bestSeason: "Selon la région",
      categories: ["aventure", "city-break"],
      cities: [
        {
          name: "New York",
          slug: "new-york",
          rating: 4.7,
          featured: true,
          lat: 40.7128,
          lng: -74.006,
          categories: ["city-break"],
          places: [
            { name: "Statue de la Liberté", slug: "statue-de-la-liberte", type: "MONUMENT", rating: 4.7 },
            { name: "Central Park", slug: "central-park", type: "PARK", rating: 4.8 },
            { name: "Times Square", slug: "times-square", type: "VIEWPOINT", rating: 4.4 },
          ],
        },
      ],
    },
    {
      name: "Maroc",
      slug: "maroc",
      continent: "afrique",
      capital: "Rabat",
      currency: "Dirham (MAD)",
      languages: ["Arabe", "Berbère"],
      flagEmoji: "🇲🇦",
      budget: 50,
      rating: 4.5,
      bestSeason: "Mars à mai & septembre-octobre",
      categories: ["aventure", "culture-patrimoine", "petit-budget"],
      cities: [
        {
          name: "Marrakech",
          slug: "marrakech",
          rating: 4.6,
          featured: true,
          lat: 31.6295,
          lng: -7.9811,
          categories: ["culture-patrimoine", "petit-budget"],
          places: [
            { name: "Place Jemaa el-Fna", slug: "jemaa-el-fna", type: "HISTORIC", rating: 4.5 },
            { name: "Jardin Majorelle", slug: "jardin-majorelle", type: "PARK", rating: 4.6 },
          ],
        },
      ],
    },
    {
      name: "Australie",
      slug: "australie",
      continent: "oceanie",
      capital: "Canberra",
      currency: "Dollar australien (A$)",
      languages: ["Anglais"],
      flagEmoji: "🇦🇺",
      budget: 120,
      rating: 4.6,
      bestSeason: "Septembre à novembre",
      categories: ["aventure", "plages-et-iles"],
      cities: [
        {
          name: "Sydney",
          slug: "sydney",
          rating: 4.7,
          featured: true,
          lat: -33.8688,
          lng: 151.2093,
          categories: ["plages-et-iles", "city-break"],
          places: [
            { name: "Opéra de Sydney", slug: "opera-de-sydney", type: "MONUMENT", rating: 4.8 },
            { name: "Bondi Beach", slug: "bondi-beach", type: "BEACH", rating: 4.6 },
          ],
        },
      ],
    },
  ];

  for (const country of data) {
    const createdCountry = await prisma.country.create({
      data: {
        name: country.name,
        slug: country.slug,
        continentId: continents[country.continent],
        capital: country.capital,
        currency: country.currency,
        languages: country.languages,
        timezones: ["UTC+1"],
        flagEmoji: country.flagEmoji,
        avgBudgetPerDay: country.budget,
        rating: country.rating,
        featured: country.featured ?? false,
        bestSeason: country.bestSeason,
        safetyLevel: "Sûr pour les voyageurs",
        visaSummary:
          "Vérifiez les conditions de visa selon votre nationalité avant le départ.",
        powerPlug: "Type C/E",
        population: 50_000_000,
        latitude: country.cities[0]?.lat,
        longitude: country.cities[0]?.lng,
        heroImage: img(`country-${country.slug}`, 1600, 900),
        gallery: [img(`${country.slug}-g1`), img(`${country.slug}-g2`)],
        summary: `${country.name} : ${country.capital} pour capitale, une culture riche et des paysages variés.`,
        description: `Le voyage en ${country.name} séduit par sa diversité. De ${country.capital} aux régions environnantes, chaque étape réserve des découvertes. La meilleure période pour visiter ${country.name} est ${country.bestSeason.toLowerCase()}.`,
        status: "PUBLISHED",
        publishedAt: new Date(),
        categories: country.categories
          ? { connect: country.categories.map((s) => ({ id: categories[s] })) }
          : undefined,
      },
    });

    for (const city of country.cities) {
      const createdCity = await prisma.city.create({
        data: {
          name: city.name,
          slug: city.slug,
          countryId: createdCountry.id,
          latitude: city.lat,
          longitude: city.lng,
          population: 2_000_000,
          rating: city.rating,
          featured: city.featured ?? false,
          recommendedDays: 3,
          avgBudgetPerDay: country.budget,
          bestSeason: country.bestSeason,
          heroImage: img(`city-${city.slug}`, 1600, 900),
          gallery: [img(`${city.slug}-g1`), img(`${city.slug}-g2`), img(`${city.slug}-g3`)],
          climate: climateSample,
          summary: `${city.name} est une destination incontournable de ${country.name}.`,
          description: `Découvrez ${city.name}, l'une des villes phares de ${country.name}. Entre monuments, gastronomie et ambiance unique, ${city.name} mérite au moins ${3} jours de visite.`,
          status: "PUBLISHED",
          publishedAt: new Date(),
          categories: city.categories
            ? { connect: city.categories.map((s) => ({ id: categories[s] })) }
            : undefined,
        },
      });

      for (const place of city.places) {
        await prisma.place.create({
          data: {
            name: place.name,
            slug: place.slug,
            cityId: createdCity.id,
            type: place.type as never,
            rating: place.rating,
            latitude: city.lat,
            longitude: city.lng,
            openingHours: "Tous les jours, 9h–18h",
            priceInfo: "À partir de 15 €",
            visitDuration: "1 à 2 heures",
            accessibility: "Accès PMR partiel",
            heroImage: img(`place-${place.slug}`, 1200, 800),
            gallery: [img(`${place.slug}-g1`), img(`${place.slug}-g2`)],
            summary: `${place.name}, un incontournable de ${city.name}.`,
            description: `${place.name} est l'un des sites les plus visités de ${city.name}. Prévoyez ${"1 à 2 heures"} pour en profiter pleinement. Pensez à réserver vos billets à l'avance en haute saison.`,
            featured: place.rating >= 4.7,
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        });
      }

      // Hôtels & restaurants (2 chacun par ville)
      await prisma.hotel.createMany({
        data: [
          {
            name: `Grand Hôtel ${city.name}`,
            slug: `grand-hotel-${city.slug}`,
            cityId: createdCity.id,
            stars: 4,
            priceRange: "EXPENSIVE",
            amenities: ["Wifi", "Petit-déjeuner", "Spa"],
            neighborhood: "Centre-ville",
            rating: 4.4,
            heroImage: img(`hotel-${city.slug}-1`, 1200, 800),
            summary: `Hôtel 4★ au cœur de ${city.name}.`,
            description: `Le Grand Hôtel ${city.name} offre un confort haut de gamme à deux pas des principaux sites.`,
            status: "PUBLISHED",
          },
          {
            name: `Auberge du Voyageur`,
            slug: `auberge-du-voyageur-${city.slug}`,
            cityId: createdCity.id,
            stars: 2,
            priceRange: "BUDGET",
            amenities: ["Wifi", "Cuisine commune"],
            neighborhood: "Quartier animé",
            rating: 4.1,
            heroImage: img(`hotel-${city.slug}-2`, 1200, 800),
            summary: `Hébergement économique et convivial à ${city.name}.`,
            description: `Idéale pour les petits budgets, l'Auberge du Voyageur est parfaite pour rencontrer d'autres voyageurs.`,
            status: "PUBLISHED",
          },
        ],
      });

      await prisma.restaurant.createMany({
        data: [
          {
            name: `Le Local`,
            slug: `le-local-${city.slug}`,
            cityId: createdCity.id,
            cuisines: ["Cuisine locale"],
            priceRange: "MODERATE",
            specialties: ["Plats traditionnels"],
            neighborhood: "Centre historique",
            rating: 4.5,
            heroImage: img(`resto-${city.slug}-1`, 1200, 800),
            summary: `Cuisine locale authentique à ${city.name}.`,
            description: `Le Local propose une cuisine traditionnelle de ${country.name} dans un cadre chaleureux.`,
            status: "PUBLISHED",
          },
          {
            name: `Bistrot Moderne`,
            slug: `bistrot-moderne-${city.slug}`,
            cityId: createdCity.id,
            cuisines: ["Fusion", "Moderne"],
            priceRange: "EXPENSIVE",
            specialties: ["Menu dégustation"],
            neighborhood: "Quartier branché",
            rating: 4.6,
            heroImage: img(`resto-${city.slug}-2`, 1200, 800),
            summary: `Une table créative à ${city.name}.`,
            description: `Le Bistrot Moderne revisite les classiques avec une touche contemporaine.`,
            status: "PUBLISHED",
          },
        ],
      });
    }
  }

  // ───────────── Articles (guides + blog) ─────────────
  console.log("📝 Articles…");
  const longContent = `## Pourquoi visiter cette destination

Cette destination offre un mélange unique de **culture**, de paysages et de gastronomie. Que vous voyagiez en famille, en couple ou en solo, vous y trouverez de quoi vous émerveiller.

## Quand partir

La meilleure période dépend de vos envies. Voici nos conseils :

- **Printemps** : températures douces et nature en fleurs
- **Été** : ambiance festive mais forte affluence
- **Automne** : couleurs magnifiques et tarifs plus doux

## Que voir absolument

Ne manquez pas les sites incontournables. Prévoyez au moins trois jours pour profiter pleinement de votre séjour.

> Conseil : réservez vos visites à l'avance pour éviter les files d'attente.

## Budget à prévoir

Comptez un budget moyen par jour incluant hébergement, repas et activités. Les petits budgets s'en sortiront très bien en choisissant des auberges et la street food.`;

  const articles = [
    {
      title: "Le Japon en 15 jours : itinéraire idéal",
      slug: "itineraire-japon-15-jours",
      type: "ITINERARY",
      featured: true,
      categories: ["culture-patrimoine", "aventure"],
      countries: ["japon"],
    },
    {
      title: "Les 10 plus belles villes d'Europe",
      slug: "plus-belles-villes-europe",
      type: "LISTICLE",
      featured: true,
      categories: ["city-break", "culture-patrimoine"],
      countries: ["france", "italie", "espagne"],
    },
    {
      title: "Voyager pas cher en Asie du Sud-Est",
      slug: "voyager-pas-cher-asie",
      type: "GUIDE",
      categories: ["petit-budget", "aventure"],
      countries: ["thailande"],
    },
    {
      title: "Week-end romantique à Venise",
      slug: "week-end-romantique-venise",
      type: "GUIDE",
      featured: true,
      categories: ["voyage-en-couple"],
      countries: ["italie"],
    },
    {
      title: "Nos coups de cœur gastronomiques en France",
      slug: "coups-de-coeur-gastronomie-france",
      type: "BLOG",
      categories: ["gastronomie"],
      countries: ["france"],
    },
    {
      title: "Comment préparer son premier grand voyage",
      slug: "preparer-premier-grand-voyage",
      type: "BLOG",
      categories: ["aventure"],
      countries: [],
    },
  ] as const;

  for (const a of articles) {
    await prisma.article.create({
      data: {
        title: a.title,
        slug: a.slug,
        type: a.type,
        excerpt: `${a.title} — découvrez nos conseils, étapes et bons plans pour réussir votre voyage.`,
        content: longContent,
        coverImage: img(`article-${a.slug}`, 1200, 675),
        authorId: a.type === "BLOG" ? admin.id : author.id,
        readingTime: 6,
        featured: "featured" in a ? a.featured : false,
        status: "PUBLISHED",
        publishedAt: new Date(),
        metaDescription: `${a.title} : guide complet, conseils pratiques et itinéraire détaillé par Atlas.`,
        categories: { connect: a.categories.map((s) => ({ id: categories[s] })) },
        countries: a.countries.length
          ? { connect: a.countries.map((s) => ({ slug: s })) }
          : undefined,
      },
    });
  }

  // ───────────── Commentaires (approuvés) ─────────────
  console.log("💬 Commentaires…");
  const paris = await prisma.city.findFirst({ where: { slug: "paris" } });
  if (paris) {
    await prisma.comment.create({
      data: {
        body: "Superbe ville, j'y retourne dès que possible ! Merci pour ce guide très complet.",
        entityType: "CITY",
        entityId: paris.id,
        authorId: author.id,
        status: "APPROVED",
      },
    });
    await prisma.comment.create({
      data: {
        body: "Des conseils très utiles pour organiser mon séjour. Top !",
        entityType: "CITY",
        entityId: paris.id,
        authorId: admin.id,
        status: "APPROVED",
      },
    });
  }

  console.log("✅ Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
