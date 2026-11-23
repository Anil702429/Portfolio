/**
 * Verified starting content: the previous portfolio, Anil's GitHub profile, and
 * the source code of the projects themselves. It is used by prisma/seed.ts, and
 * as a read-only preview when DATABASE_URL is not set.
 */

export const defaultSettings = {
  name: "Anil Rijal",
  professionalTitle: "Python & Django Full-Stack Developer",
  introduction:
    "I build web applications, REST APIs and the database systems behind them, from the data model through to deployment.",
  about: `I'm a Python and Django developer and CSIT student from Nepal. I enjoy turning ideas into practical, maintainable software and understanding how the complete system fits together.

My primary focus is backend engineering: application architecture, REST APIs, authentication, database models and the infrastructure that keeps applications running reliably.

I also work across the stack when a project requires it, from a responsive frontend to a Django backend, database and deployment environment.`,
  location: "Nepal",
  availability: "Available for opportunities, in Nepal or remote",
  profileImage: "/images/profile-photo.jpg" as string | null,
  githubUrl: "https://github.com/Anil702429" as string | null,
  linkedinUrl: "https://www.linkedin.com/in/anil-rijal-84559124/" as string | null,
  email: "anilrijal980@gmail.com" as string | null,
  resumeUrl: null as string | null,
  heroSnippet: `def verify_esewa_response_signature(data):
    """Verify a callback using eSewa's signed_field_names payload."""
    signed_field_names = data.get('signed_field_names', '')
    if not signed_field_names or not data.get('signature'):
        return False

    message = ','.join(
        f'{field}={data.get(field, "")}'
        for field in signed_field_names.split(',')
    )
    ...
    return hmac.compare_digest(expected, data['signature'])`,
  heroSnippetLabel: "NepCart, payments/utils.py (excerpt)",
  heroSnippetUrl:
    "https://github.com/Anil702429/NepCart/blob/HEAD/payments/utils.py" as string | null,
};

export const defaultSocialLinks = [
  { label: "Instagram", url: "https://www.instagram.com/anilrijal980/" },
  { label: "YouTube", url: "https://www.youtube.com/@wonderwire-cartoons" },
];

export const defaultSkillGroups = [
  { name: "Backend", skills: ["Python", "Django", "Django REST Framework", "REST APIs"] },
  { name: "Data", skills: ["PostgreSQL", "MySQL", "SQLite", "Django ORM"] },
  { name: "Frontend", skills: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Bootstrap"] },
  { name: "Tools and deployment", skills: ["Git", "GitHub", "Docker", "Linux", "Vercel"] },
];

export const defaultEducation = [
  { title: "CSIT student", institution: "", period: "" },
];

export const defaultProjects = [
  {
    title: "NepCart",
    slug: "nepcart",
    category: "Full-stack web application",
    shortDescription:
      "An e-commerce platform built with Django: catalogue, cart, checkout, orders and payments.",
    description:
      "A full-stack e-commerce platform built with Django, designed to manage products, users, orders and core shopping workflows through a structured web application.",
    problem:
      "An online shop has to keep several things consistent at once: what is in the cart, what price was agreed, whether an order exists, and whether it was really paid for.",
    solution:
      "NepCart splits the shop into focused Django apps. Orders are written inside a database transaction, and a payment is only accepted after the gateway's signed response has been verified.",
    features: [
      "Product and category catalogue with stock and discount pricing",
      "Customer accounts with registration, login and profiles",
      "Per-user cart with one row per product",
      "Checkout, order history and order details",
      "Cash on delivery and eSewa payment flows",
    ],
    content: `## App structure

The project is divided into Django apps by responsibility. Accounts, products, cart, orders and payments each hold their own models, views and URLs.

## Checkout as one transaction

Creating the order, copying its items and emptying the cart happen inside \`transaction.atomic()\`. If any step fails, none of them apply.

\`\`\`python
with transaction.atomic():
    order = form.save(commit=False)
    order.user = request.user
    order.order_number = f'NC-{uuid.uuid4().hex[:12].upper()}'
    order.subtotal = subtotal
    order.delivery_charge = delivery_charge
    order.total = total
    order.save()

    OrderItem.objects.bulk_create([...])
    cart_items.delete()
\`\`\`

Order items store the product name and price at the time of purchase, so later catalogue edits do not rewrite order history.

## Verifying payments

Returning from eSewa is not treated as proof of payment. Before an order is marked paid, the server checks the response status, its HMAC-SHA256 signature, the transaction ID, the product code and the amount against the stored order. Signatures are compared with \`hmac.compare_digest\`.

## Access control

Cart and order views require login, and orders are looked up by order number together with the current user, so one customer cannot open another's order.`,
    coverImage: "/images/projects/nepcart.webp" as string | null,
    githubUrl: "https://github.com/Anil702429/NepCart" as string | null,
    liveUrl: "https://nepcart.anilrijal.info.np/" as string | null,
    featured: true,
    published: true,
    technologies: ["Python", "Django", "HTML", "CSS", "JavaScript"],
  },
  {
    title: "Shots by Anil",
    slug: "shots-by-anil",
    category: "Photography gallery",
    shortDescription:
      "A photography gallery built with Django, for nature, landscape and atmospheric smartphone photos.",
    description:
      "A personal photography portfolio and web gallery designed to showcase nature, landscape and atmospheric smartphone photography.",
    problem:
      "A growing photo collection needs to stay organised and easy to update without editing pages by hand for every new picture.",
    solution:
      "Photos are managed through the Django admin. Each belongs to a category and can be marked as featured or used as the hero image, while the public site stays focused on the pictures.",
    features: [
      "Curated gallery organised by category",
      "Individual photo pages",
      "Camera and exposure details read from EXIF data",
      "Responsive image layouts",
      "About page and contact form",
    ],
    content: `## Reading EXIF data

When a photo is saved, the model reads its EXIF tags with ExifRead for the camera model, lens, focal length, aperture, shutter speed and ISO.

## Media storage

Uploads use Cloudinary when it is configured and the local file system otherwise, through Django's \`STORAGES\` setting. Static files are served with WhiteNoise.

## Publishing workflow

The Django admin shows thumbnails and includes bulk actions for choosing featured photos and the hero image.`,
    coverImage: "/images/projects/shots-by-anil.webp" as string | null,
    githubUrl: null as string | null,
    liveUrl: "https://shots.anilrijal.info.np/" as string | null,
    featured: true,
    published: true,
    technologies: ["Python", "Django", "Cloudinary", "HTML", "CSS", "JavaScript"],
  },
];

/** Listed on Anil's GitHub profile. Seeded unpublished, to be completed in the admin. */
export const draftProjects = [
  {
    title: "NepFlix",
    slug: "nepflix",
    category: "Movie ticket booking",
    shortDescription:
      "A Django-based movie booking platform focused on a practical end-to-end booking experience.",
    description:
      "A Django-based movie booking platform focused on a practical end-to-end booking experience.",
    problem: "",
    solution: "",
    features: [
      "Interactive seat booking",
      "Reviews and ratings",
      "Payment integration",
      "Membership system",
      "Cancellation and refunds",
      "Analytics",
    ],
    content: "",
    coverImage: null as string | null,
    githubUrl: "https://github.com/Anil702429/NepFlix" as string | null,
    liveUrl: "https://nep-flix.vercel.app" as string | null,
    featured: false,
    published: false,
    technologies: ["Python", "Django", "JavaScript"],
  },
  {
    title: "CSIT GOD",
    slug: "csit-god",
    category: "Academic resources",
    shortDescription:
      "A Django-based platform for organising learning materials and resources for CSIT students.",
    description:
      "A Django-based platform focused on organising learning materials and resources for CSIT students.",
    problem: "",
    solution: "",
    features: ["Study resources", "Academic materials", "Organised content"],
    content: "",
    coverImage: null as string | null,
    githubUrl: "https://github.com/Anil702429/CSIT_GOD" as string | null,
    liveUrl: null as string | null,
    featured: false,
    published: false,
    technologies: ["Python", "Django", "JavaScript"],
  },
];
