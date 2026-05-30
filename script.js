const collections = [
  {
    id: "shanghai",
    title: "Shanghai",
    label: "上海",
    cover: "./assets/photos/shanghai/a-15-thumb.jpg",
    photos: [
      ["a-14", "上海"],
      ["a-15", "上海"],
      ["a-23", "上海"],
    ],
  },
  {
    id: "beijing",
    title: "Beijing",
    label: "北京",
    cover: "./assets/photos/beijing/a-15-thumb.jpg",
    photos: [
      ["a-7", "北京"],
      ["a-15", "北京"],
      ["a-16", "北京"],
    ],
  },
  {
    id: "shenzhen",
    title: "Shenzhen",
    label: "深圳",
    cover: "./assets/photos/shenzhen/a-14-thumb.jpg",
    photos: [
      ["a-3", "深圳"],
      ["a-4", "深圳"],
      ["a-8", "深圳"],
      ["a-12", "深圳"],
      ["a-14", "深圳"],
      ["a-15", "深圳"],
    ],
  },
  {
    id: "hong-kong",
    title: "Hong Kong",
    label: "香港",
    cover: "./assets/photos/hong-kong/a-18-2-thumb.jpg",
    photos: [
      ["a-12-2", "香港"],
      ["a-13-2", "香港"],
      ["a-18-2", "香港"],
    ],
  },
  {
    id: "andorra",
    title: "Andorra",
    label: "安道尔",
    cover: "./assets/photos/andorra/a-22-thumb.jpg",
    photos: [
      ["a-1-2", "安道尔"],
      ["a-5", "安道尔"],
      ["a-11", "安道尔"],
      ["a-12", "安道尔"],
      ["a-14", "安道尔"],
      ["a-22", "安道尔"],
    ],
  },
  {
    id: "spain",
    title: "Spain",
    label: "西班牙",
    cover: "./assets/photos/spain/third-2-thumb.jpg",
    photos: [
      ["third-1", "西班牙"],
      ["third-2", "西班牙"],
      ["third-3", "西班牙"],
      ["third-4", "西班牙"],
      ["third-5", "西班牙"],
      ["third-6", "西班牙"],
    ],
  },
  {
    id: "shanghai-f1-2025",
    title: "Shanghai F1 2025",
    label: "2025 上海F1",
    cover: "./assets/photos/shanghai-f1-2025/a-11-thumb.jpg",
    photos: [
      ["a-1", "上海 F1 2025"],
      ["a-2", "上海 F1 2025"],
      ["a-7", "上海 F1 2025"],
      ["a-8", "上海 F1 2025"],
      ["a-11", "上海 F1 2025"],
      ["a-15", "上海 F1 2025"],
      ["a-19", "上海 F1 2025"],
    ],
  },
];

const allPhotos = collections.flatMap((collection) =>
  collection.photos.map(([slug, place], index) => ({
    slug,
    place,
    caption: `${place} ${String(index + 1).padStart(2, "0")}`,
    collectionId: collection.id,
    thumb: `./assets/photos/${collection.id}/${slug}-thumb.jpg`,
    large: `./assets/photos/${collection.id}/${slug}-large.jpg`,
  })),
);

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const placeMenu = document.querySelector("[data-place-menu]");
const collectionGrid = document.querySelector("[data-collection-grid]");
const collectionView = document.querySelector("[data-collection-view]");
const collectionViewLabel = document.querySelector("[data-collection-label]");
const collectionViewTitle = document.querySelector("[data-collection-title]");
const collectionPhotos = document.querySelector("[data-collection-photos]");
const collectionClose = document.querySelector(".collection-close");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const closeButton = document.querySelector(".lightbox-close");
const previousButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

let activeIndex = 0;
let activePhotoIndexes = allPhotos.map((_, index) => index);

function renderPlacesMenu() {
  placeMenu.innerHTML = collections
    .map(
      (collection) => `
        <a href="#collections" data-collection-link="${collection.id}">
          ${collection.title}
          <span>${collection.label}</span>
        </a>
      `,
    )
    .join("");
}

function renderCollections() {
  collectionGrid.innerHTML = collections
    .map(
      (collection) => `
        <button class="collection-card reveal" type="button" data-collection-id="${collection.id}">
          <span class="collection-cover">
            <img class="collection-cover-bg" src="${collection.cover}" alt="" aria-hidden="true" loading="lazy" />
            <img class="collection-cover-img" src="${collection.cover}" alt="${collection.label}作品封面" loading="lazy" />
          </span>
          <span class="collection-caption">
            <strong>${collection.title}</strong>
            <span>${collection.photos.length} 张照片</span>
          </span>
        </button>
      `,
    )
    .join("");
}

function getCollectionPhotoIndexes(collectionId) {
  return allPhotos
    .map((photo, index) => (photo.collectionId === collectionId ? index : -1))
    .filter((index) => index !== -1);
}

function openCollection(collectionId) {
  const collection = collections.find((item) => item.id === collectionId);
  if (!collection) return;

  activePhotoIndexes = getCollectionPhotoIndexes(collection.id);
  collectionViewLabel.textContent = collection.label;
  collectionViewTitle.textContent = collection.title;
  collectionPhotos.innerHTML = activePhotoIndexes
    .map((photoIndex, index) => {
      const photo = allPhotos[photoIndex];
      return `
        <button class="collection-photo-card" type="button" data-photo-index="${photoIndex}">
          <img src="${photo.large}" alt="${photo.caption}" loading="lazy" />
          <span>${String(index + 1).padStart(2, "0")}</span>
        </button>
      `;
    })
    .join("");

  collectionView.classList.add("is-open");
  collectionView.setAttribute("aria-hidden", "false");
  updateBodyLock();
  collectionClose.focus({ preventScroll: true });
}

function closeCollection() {
  collectionView.classList.remove("is-open");
  collectionView.setAttribute("aria-hidden", "true");
  activePhotoIndexes = allPhotos.map((_, index) => index);
  updateBodyLock();
}

function bindCollections() {
  collectionGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-collection-id]");
    if (!button) return;
    openCollection(button.dataset.collectionId);
  });

  placeMenu.addEventListener("click", (event) => {
    const link = event.target.closest("[data-collection-link]");
    if (!link) return;
    event.preventDefault();
    closeMobileMenu();
    openCollection(link.dataset.collectionLink);
  });

  collectionClose.addEventListener("click", closeCollection);

  collectionView.addEventListener("click", (event) => {
    if (event.target === collectionView) closeCollection();
  });
}

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMobileMenu() {
  header.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function updateBodyLock() {
  const hasOpenLayer =
    collectionView.classList.contains("is-open") || lightbox.classList.contains("is-open");
  document.body.classList.toggle("is-locked", hasOpenLayer);
}

function bindNavigation() {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  header.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMobileMenu();
    }
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();
}

function openLightbox(index) {
  const photo = allPhotos[index];
  if (!photo) return;

  activeIndex = index;
  lightboxImage.src = photo.large;
  lightboxImage.alt = photo.caption;
  const sequence = activePhotoIndexes.includes(index)
    ? activePhotoIndexes.indexOf(index) + 1
    : index + 1;
  lightboxCaption.textContent = `${photo.place} · ${String(sequence).padStart(2, "0")}`;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  updateBodyLock();
  closeButton.focus({ preventScroll: true });
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  updateBodyLock();
}

function stepLightbox(direction) {
  const currentPosition = activePhotoIndexes.indexOf(activeIndex);
  const safePosition = currentPosition === -1 ? 0 : currentPosition;
  const nextPosition =
    (safePosition + direction + activePhotoIndexes.length) % activePhotoIndexes.length;
  openLightbox(activePhotoIndexes[nextPosition]);
}

function bindLightbox() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-photo-index]");
    if (!button) return;
    openLightbox(Number(button.dataset.photoIndex));
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => stepLightbox(-1));
  nextButton.addEventListener("click", () => stepLightbox(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (event) => {
    if (lightbox.classList.contains("is-open")) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") stepLightbox(-1);
      if (event.key === "ArrowRight") stepLightbox(1);
      return;
    }

    if (event.key === "Escape" && collectionView.classList.contains("is-open")) {
      closeCollection();
    }
  });
}

function bindRevealAnimation() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

renderPlacesMenu();
renderCollections();
bindNavigation();
bindCollections();
bindLightbox();
bindRevealAnimation();
