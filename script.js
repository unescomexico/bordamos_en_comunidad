document.addEventListener('DOMContentLoaded', function () {
  const tocLinks = document.querySelectorAll('.toc a');
  const headerOffset = 60;

  tocLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Scroll al destino con compensación del header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // 🔽 Expandimos automáticamente la sección-content que sigue al título
        const targetContent = target.nextElementSibling;
        if (targetContent && targetContent.classList.contains('section-content')) {
          expandSection(targetContent);
        }

        // 🔽 También expandimos padres colapsables si existen
        expandParents(target);
      }
    });
  });

  // Observador para marcar el índice activo
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.isIntersecting) {
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.6
  });

  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(section => {
    observer.observe(section);
  });

  // Sidebar izquierdo toggle
  const toggleBtn = document.getElementById('toggle-toc');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const tocElement = document.querySelector('.toc');
      if (tocElement) {
        tocElement.classList.toggle('expanded');
      }
    });
  }

  // Sidebar derecho toggle
  const toggleRightBtn = document.getElementById('toggle-right-sidebar');
  if (toggleRightBtn) {
    toggleRightBtn.addEventListener('click', function () {
      const rightSidebar = document.querySelector('.right-sidebar');
      if (rightSidebar) {
        rightSidebar.classList.toggle('expanded');
      }
    });
  }

  // Expandir sección
  function expandSection(section) {
    section.style.maxHeight = section.scrollHeight + 'px';
    section.style.paddingTop = '20px';
    section.style.paddingBottom = '20px';
    section.classList.add('expanded');
    updateParentHeights(section);
  }

  // Contraer sección
  function collapseSection(section) {
    section.style.maxHeight = '0px';
    section.style.paddingTop = '0';
    section.style.paddingBottom = '0';
    section.classList.remove('expanded');
    updateParentHeights(section);
  }

  // Calcular altura de hijos
  function recalcContainerHeight(container) {
    let total = 0;
    Array.from(container.children).forEach(child => {
      total += child.offsetHeight;
    });
    container.style.maxHeight = total + 'px';
  }

  // Actualiza altura de los padres
  function updateParentHeights(element) {
    let currentCollapsible = element.closest('.collapsible');
    let parentCollapsible =
      currentCollapsible && currentCollapsible.parentElement
        ? currentCollapsible.parentElement.closest('.collapsible')
        : null;
    while (parentCollapsible) {
      const parentContent = parentCollapsible.querySelector('.section-content');
      if (parentContent) {
        recalcContainerHeight(parentContent);
      }
      parentCollapsible =
        parentCollapsible.parentElement
          ? parentCollapsible.parentElement.closest('.collapsible')
          : null;
    }
  }

  // 🔁 Expandir padres colapsables si están contraídos
  function expandParents(element) {
    let parent = element.closest('.collapsible');
    while (parent) {
      const parentContent = parent.querySelector('.section-content');
      if (parentContent && !parentContent.classList.contains('expanded')) {
        expandSection(parentContent);
      }
      parent = parent.parentElement.closest('.collapsible');
    }
  }

  // Toggle de secciones internas por clic en títulos
  const collapsibleHeaders = document.querySelectorAll(
    '.collapsible h1, .collapsible h2, .collapsible h3, .collapsible h4, .collapsible h5, .collapsible h6'
  );

  collapsibleHeaders.forEach(header => {
    header.addEventListener('click', function (e) {
      e.stopPropagation();
      const content = this.nextElementSibling;
      if (content && content.classList.contains('section-content')) {
        const isExpanded = content.classList.contains('expanded');
        if (isExpanded) {
          collapseSection(content);
        } else {
          expandSection(content);
        }
      }
    });
  });
});
