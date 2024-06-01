const mountLinks = (
  onClick: (path: string) => void = () => {},
  selector: string = 'a[data-system=true]',
) => {
  const onClickHandler = handleLinkClickFactory(onClick);
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener('click', onClickHandler);
  });
};

function handleLinkClickFactory(onClick: (path: string) => void) {
  return function (event: Event) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    if (
      !target ||
      (target.tagName !== 'A' &&
        target.getAttribute('aria-role') !== 'link' &&
        !!target.getAttribute('href'))
    ) {
      return;
    }

    event.stopPropagation();
    const path = target.getAttribute('href');

    if (path) {
      onClick(path);
    }
  };
}

class Layout {
  constructor(private template: (v: string) => string, private renderNode: HTMLElement) {}
  render(v: string) {
    this.renderNode.innerHTML = this.template(v);
  }
}

class Router {
  constructor(private routes: { [key: string]: (v: any) => string }, private layout: Layout) {}
  goToPath(path: string, state: Record<string, any> = {}) {
    history.pushState(state, '', path);
    this.layout.render(this.routes[path]?.(state) ?? this.routes[404]?.(state) ?? '');
    mountLinks(this.goToPath.bind(this));
    const activeLink = document.querySelectorAll(`a[href='${window.location.pathname}']`);
    activeLink.forEach((element: any) => {
      if (element.dataset.ignoreHighlighting) {
        return;
      }
      element.classList.add('active');
    });
  }
}

export { Layout, Router };
