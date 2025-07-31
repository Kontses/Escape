export const person = {
  firstName: "Escape",
  lastName: "",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Studio / Soundsystem",
  avatar: "/images/avatar.jpg",
  email: "escape23collective@gmail.com",
  location: "", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  displayLocation: false, // Display location for UI
  languages: [], // optional: Leave the array empty if you don't want to display languages
};

export const newsletter = {
  display: true,
  title: <>Εγγραφτείτε στο Newsletter των {person.firstName}</>,
  description: (
    <>
      Εγγραφτείτε στο Newsletter για να μείνετε ενημερωμένοι για τις επόμενες κυκλοφορίες μας, καθώς και τις δημόσιες εκδηλώσεις.
    </>
  ),
};

export const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  { /*
    name: "GitHub",
    icon: "github",
    link: "https://github.com/once-ui-system/nextjs-starter",
  }, 
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/company/once-ui/",
  },
  {*/
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/escape23collective",
  }, 
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

export const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Escape</>,
  featured: {
    display: true,
    title: <>Αυτοπαρουσιαστικό</>,
    href: "/about",
  },
  subline: (
    <>
      Το Escape είναι μια μουσική κολεκτίβα που δημιουργήθηκε για να αφυπνίσει συνειδήσεις και να κουνίσει κώλους, τόσο μεταφορικά όσο και... κυριολεκτικά.
      <br /><br />Δραστηριοποιούμαστε κυρίως σε ένα studio στο κέντρο της Θεσσαλονίκης και τις όμορφες μέρες αποδράμε από την πόλη με τους φίλους μας στήνοντας το ηχοσύστημα μας σε όποιο μέρος έχει μείνει ακόμα ανέγγιχτο από το βίαιο εκπολιτισμό της αναπτυσώμενης οικονομίας.
    </>
  ),
};

export const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.displayLocation}`,
  tableOfContent: {
    display: true,
    subItems: true,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Εισαγωγή",
    description: (
      <>
        Η κολεκτίβα Escape είναι ένα αυτοοργανωμένο μουσικό στούντιο που στεγάζεται σε μία τσιμεντένια τρύπα στο κέντρο της πόλης, αλλά για εμάς είναι και κάτι περισσότερο από αυτό…
      </>
    ),
  },
  work: {
    display: false, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "FLY",
        timeframe: "2022 - Present",
        role: "Senior Design Engineer",
        achievements: [
          <>
            Redesigned the UI/UX for the FLY platform, resulting in a 20% increase in user
            engagement and 30% faster load times.
          </>,
          <>
            Spearheaded the integration of AI tools into design workflows, enabling designers to
            iterate 50% faster.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/Live-Sets/cover-01.jpg",
            alt: "Once UI Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Creativ3",
        timeframe: "2018 - 2022",
        role: "Lead Designer",
        achievements: [
          <>
            Developed a design system that unified the brand across multiple platforms, improving
            design consistency by 40%.
          </>,
          <>
            Led a cross-functional team to launch a new product line, contributing to a 15% increase
            in overall company revenue.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: false, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Jakarta",
        description: <>Studied software engineering.</>,
      },
      {
        name: "Build the Future",
        description: <>Studied online marketing and personal branding.</>,
      },
    ],
  },
  technical: {
    display: false, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Figma",
        description: <>Able to prototype in Figma with Once UI with unnatural speed.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/Live-Sets/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/Live-Sets/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Next.js",
        description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/Live-Sets/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  // Add your custom sections here
  customSections: [
    {
      title: "Ποιος είναι ο σκοπός μας",
      description: (
        <>
          Μέσα στα αμέτρητα Airbnb που ξεπροβάλλουν στο κέντρο της Θεσσαλονίκης και των παλιών μουσικών στούντιο που στεγαζόμασταν να κλείνουν, οι ανάγκες μας για να παίξουμε με τα μασίνια μας και να χώσουμε τα ραπ μας, να ακούσουμε τις μουσικές μας και να χορέψουμε παρέα, παραμένουν. Η κολεκτίβα Escape δημιουργήθηκε για να καλύψει τόσο τις μουσικές μας ανάγκες, αλλά και για να διαμεσολαβήσει στην σύναψη των κοινωνικών μας σχέσεων τόσο μεταξύ μας μέσα στο στούντιο, αλλά τόσο και μαζί σας μέσα από τις εκδηλώσεις και τα ρέιβ πάρτι, μιας και ξέρουμε πολύ καλά πως χωρίς τους δικούς μας χώρους και την δικιά μας αντικουλτούρα, δεν θα μπορούσαμε να γίνουμε 'οι άνθρωποι μας'.
        </>
      ),
    },
    {
      title: "Η Φιλοσοφία μας",
      description: (
        <>
          Αντιλαμβανόμαστε την κουλτούρα μας ως αντικουλτούρα, μιας και οι αξίες μας διαφέρουν ουσιαστικά από εκείνες της κυρίαρχης κοινωνίας, και αναγνωρίζουμε ότι πηγή του προβλήματος της κυριαρχίας είναι η απώλεια της ενότητας του κόσμου, να μπορούμε να αλλάζουμε τις συνθήκες της ύπαρξής μας. Για αυτό και επιλέγουμε να εκφραστούμε με συλλογικό και αυτοοργανωμένο τρόπο, αντι-ιεραρχικά και με τους δικούς μας όρους μιας και εμείς αναγνωρίζουμε καλύτερα τις δικές μας ανάγκες.
          <br></br>Απορρίπτουμε τις πρακτικές της μουσικής βιομηχανίας, επιλέγουμε να κρατήσουμε την μουσική μας ως παιχνίδι και όχι να την μετατρέψουμε σε εμπόρευμα με απώτερο σκοπό το κέρδος, μιας και η μουσική έμεινε από τα λίγα παιχνίδια που ακόμα παίζουμε ως ενήλικες. Δεν θέλουμε να νιώσουμε αποξενωμένοι μέσα από τα κοινωνικά πρότυπα για να νιώσουμε αρεστοί, δεν θέλουμε τα συμβόλαια της μουσικής βιομηχανίας να μετασχηματίσουν τις δημιουργικές μας διαδικασίες με τις ‘φόρμουλες’ επιτυχίας της, αποποιούμαστε τις μόδες, και τον τοξικό ανταγωνισμό. 
          <br></br>Κατ' επ' επέκταση αυτών, επιλέγουμε κάθε είδους χρηματικού κέρδους να προορίζεται για τις στεγαστικές ανάγκες του στούντιο, τον εξοπλισμό μας και την επέκταση του με σκοπό να μπορούμε να αντεπεξερχόμαστε πιο οργανωμένα στις εκδηλώσεις μας. Έτσι πιστεύουμε πως κάθε χρηματική απολαβή θα ανακυκλώνεται πίσω στην κοινότητα και σε καμία ατομική τσέπη.
        </>
      ),
    },
    {
      title: "Κατακλείδα",
      description: (
        <p><em>"Δεν έχουμε τίποτα δικό μας, παρά μόνο τον χρόνο, τον οποίο μπορούν να απολαύσουν και όσοι δεν έχουν που την κεφαλήν κλίνει."</em> - Μπαλτάσαρ Γκρασιάν</p>
      ),
    },
  ],
};

export const blog = {
  path: "/blog",
  label: "Blog",
  title: "Ιστολόγιο για την μουσική & την κουλτούρα",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

export const work = {
  path: "/work",
  label: "Work",
  title: `Work – ${person.name}`,
  description: `Our musical projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

export const musicVideos = {
  path: "/work/music-videos",
  label: "Music Videos",
  title: "Music Videos – Escape",
  description: "Δείτε τα τελευταία μουσικά βίντεο μας.",
};

export const discography = {
  path: "/work/discography",
  label: "Discography",
  title: "Discography – Escape",
  description: "Ακούστε την επίσημη δισκογραφία μας.",
};

export const djSets = {
  path: "/work/dj-sets",
  label: "DJ Sets",
  title: "DJ Sets – Escape",
  description: "Ακούστε τα τελευταία DJ sets μας.",
};

export const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};
