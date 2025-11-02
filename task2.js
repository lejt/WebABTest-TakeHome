(() => {
  const AB_ELEMENT_ID = 'data-ab-element-id';
  const STICKY_CONTAINER_ATTR_NAME = 'sticky-container';
  const STICKY_HEADER_ATTR_NAME = 'sticky-header';
  const STICKY_BODY_ATTR_NAME = 'sticky-body';
  const SLIDER_WRAPPER_ATTR_NAME = 'slider-wrapper';

  // API constants
  const POKEMON_COUNT = 10;
  const POKEMON_URL = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_COUNT}`;
  // media width
  const BREAKPOINTS = {
    MOBILE: 0,
    TABLET: 768,
    DESKTOP: 1024,
  };

  const overlay = document.createElement('div');
  const stickyDrawerContainer = document.createElement('div');
  const stickyDrawerHeader = document.createElement('div');
  const stickyDrawerBody = document.createElement('div');
  const sliderWrapper = document.createElement('div');

  overlay.setAttribute('data-ab-element-id', 'injected-overlay');
  stickyDrawerContainer.setAttribute(AB_ELEMENT_ID, STICKY_CONTAINER_ATTR_NAME);
  stickyDrawerHeader.setAttribute(AB_ELEMENT_ID, STICKY_HEADER_ATTR_NAME);
  stickyDrawerBody.setAttribute(AB_ELEMENT_ID, STICKY_BODY_ATTR_NAME);
  sliderWrapper.setAttribute(AB_ELEMENT_ID, SLIDER_WRAPPER_ATTR_NAME);

  stickyDrawerHeader.innerHTML = `
    <div class="drawer-title">Explore Our Sticky Drawer</div>
    <div class="controls-container">
      <div class="pagination-controls">
          <button class="nav-arrow left">&lt;</button>
          <span class="page-counter">1/1</span>
          <button class="nav-arrow right">&gt;</button>
      </div>
      <!-- Chevron points UP when closed (ready to open UP) -->
      <span class="chevron-icon">&#9650;</span> 
    </div>
  `;

  let currentPage = 1;
  let totalPages = 1;
  let cardsPerPage = 1;
  let pokemonData = [];
  let isLoading = true;

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const closeDrawer = () => {
    if (stickyDrawerContainer.classList.contains('is-open')) {
      stickyDrawerContainer.classList.remove('is-open');

      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';

        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;

        // handle scroll correction AFTER the 500ms CSS transition finishes
        const newMaxScroll = scrollHeight - clientHeight;
        const currentScrollPosition = window.scrollY;

        if (currentScrollPosition > newMaxScroll && newMaxScroll >= 0) {
          window.scrollTo(0, newMaxScroll);
        }
      }, 500);
    }
  };

  const openDrawer = () => {
    if (!stickyDrawerContainer.classList.contains('is-open')) {
      document.body.appendChild(overlay);

      stickyDrawerContainer.classList.add('is-open');
      updatePaginationUI();
    }
  };

  const updatePaginationUI = () => {
    cardsPerPage = getCardsPerPage();
    totalPages = Math.ceil(POKEMON_COUNT / cardsPerPage);

    currentPage = Math.min(currentPage, totalPages);
    currentPage = Math.max(currentPage, 1);

    const pageCounter = stickyDrawerHeader.querySelector('.page-counter');
    const prevArrow = stickyDrawerHeader.querySelector('.nav-arrow.left');
    const nextArrow = stickyDrawerHeader.querySelector('.nav-arrow.right');

    if (pageCounter) {
      pageCounter.textContent = `${currentPage}/${totalPages}`;
    }
    if (prevArrow) {
      prevArrow.classList.toggle('is-disabled', currentPage === 1);
    }
    if (nextArrow) {
      nextArrow.classList.toggle('is-disabled', currentPage === totalPages);
    }

    const targetCardIndex = (currentPage - 1) * cardsPerPage;
    const targetCard = sliderWrapper.children[targetCardIndex];

    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
      });
    } else {
      sliderWrapper.scrollLeft = 0;
    }
  };

  // determines how many cards should be visible per page in sliderWrapper based on the current viewport width
  const getCardsPerPage = () => {
    const width = window.innerWidth;
    if (width >= BREAKPOINTS.DESKTOP) return 4;
    if (width >= BREAKPOINTS.TABLET) return 2;
    return 1;
  };

  const paginateAction = (direction) => {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      updatePaginationUI();
    }
  };

  const createCard = (data = null) => {
    const card = document.createElement('div');
    const contentWrapper = document.createElement('div');
    const header = document.createElement('div');
    const slideTitle = document.createElement('h6');
    const toolTip = document.createElement('div');
    const toolTipContent = document.createElement('span');
    const imageContainer = document.createElement('div');
    const description = document.createElement('p');
    const button = document.createElement('button');

    card.className = 'info-card';
    contentWrapper.className = 'card-content-wrapper';
    header.className = 'card-header';
    slideTitle.className = 'slide-title';
    toolTip.className = 'slide-tooltip';
    imageContainer.className = 'image-container';
    description.className = 'slide-description';
    button.className = 'slide-button';
    toolTipContent.className = 'tooltip-content';

    if (data) {
      const types = data.types.map((t) => t.type.name).join(', ');
      slideTitle.textContent = data.name.toUpperCase();
      imageContainer.innerHTML = `<img 
        src="${data.sprites.front_default}" 
        alt="${data.name}" 
        onerror="this.src='https://placehold.co/64x64/CCCCCC/333333?text=IMG'"
      >`;
      description.textContent = `ID: ${data.id}. Type: ${types}`;
      button.textContent = 'View Details';
      toolTipContent.textContent = `Weight: ${data.weight * 1000} grams`;
    } else {
      slideTitle.textContent = 'Loading...';
      description.textContent = 'Fetching data from API...';
      imageContainer.textContent = 'Image Slot';
      button.textContent = '...';
      toolTipContent.textContent = 'Loading...';
    }

    toolTip.textContent = 'ⓘ';
    toolTip.appendChild(toolTipContent);
    header.append(slideTitle, toolTip);
    contentWrapper.append(header, imageContainer, description, button);
    card.appendChild(contentWrapper);

    return card;
  };

  const handleScrollToClose = () => {
    const isDrawerOpen = stickyDrawerContainer.classList.contains('is-open');
    if (!isDrawerOpen) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition + clientHeight >= scrollHeight - 1) {
      closeDrawer();
    }
  };

  const fetchPokemonData = async () => {
    isLoading = true;
    try {
      const response = await fetch(POKEMON_URL);
      if (!response.ok) throw new Error('Failed to fetch Pokémon list');
      const data = await response.json();

      const detailPromises = data.results.map((p) => fetch(p.url));
      const detailResponses = await Promise.all(detailPromises);

      const jsonPromises = detailResponses.map((res, index) => {
        const pokemonName = data.results[index].name;

        if (!res.ok) {
          throw new Error(
            `Failed to fetch details for ${pokemonName}. Status: ${res.status}`
          );
        }
        return res.json();
      });

      pokemonData = await Promise.all(jsonPromises);
    } catch (error) {
      console.error('API Error: Could not load Pokémon data.', error);
    } finally {
      isLoading = false;
      populateSlider();
      updatePaginationUI();
    }
  };

  const populateSlider = () => {
    // clear previous content
    sliderWrapper.innerHTML = '';

    if (isLoading) {
      for (let i = 0; i < POKEMON_COUNT; i++) {
        sliderWrapper.appendChild(createCard(null));
      }
    } else if (pokemonData.length > 0) {
      pokemonData.forEach((data) => {
        sliderWrapper.appendChild(createCard(data));
      });
    } else {
      // Show a single error card if fetch failed completely
      const errorCard = createCard({
        name: 'Error',
        id: 'N/A',
        sprites: { front_default: '' },
        types: [{ type: { name: 'Fetch Failed' } }],
      });
      errorCard.querySelector('.slide-description').textContent =
        'Failed to load Pokémon data from API.';
      errorCard.style.backgroundColor = 'lightcoral';
      sliderWrapper.appendChild(errorCard);
    }
  };

  const initListeners = () => {
    stickyDrawerHeader.addEventListener('click', () => {
      const isOpen = stickyDrawerContainer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    overlay.addEventListener('click', closeDrawer);

    // pagination
    stickyDrawerHeader
      .querySelector('.nav-arrow.left')
      .addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent drawer toggle
        paginateAction(-1);
      });
    stickyDrawerHeader
      .querySelector('.nav-arrow.right')
      .addEventListener('click', (e) => {
        e.stopPropagation();
        paginateAction(1);
      });

    window.addEventListener('scroll', debounce(handleScrollToClose, 100));

    // update pagination/position on resize
    window.addEventListener(
      'resize',
      debounce(() => {
        updatePaginationUI();
      }, 100)
    );
  };

  stickyDrawerBody.appendChild(sliderWrapper);
  stickyDrawerContainer.append(stickyDrawerHeader, stickyDrawerBody);
  document.body.appendChild(stickyDrawerContainer);

  initListeners();
  fetchPokemonData();
})();
