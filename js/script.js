let review_swiper = new Swiper("#reviews-swiper", {
  speed: 800,
  slidesPerView: 1,
  navigation: {
    nextEl: "#reviews-swiper-control-button-next",
    prevEl: "#reviews-swiper-control-button-prev",
  },
  a11y: {
    prevSlideMessage: "Previous review",
    nextSlideMessage: "Next review",
  },
  breakpoints: {
    // when window width is >= 977
    977: {
      slidesPerView: 3,
    },
  },
});
let portfolio_swiper = new Swiper("#work-samples-swiper", {
  speed: 800,
  slidesPerView: 1,
  observer: true,
  navigation: {
    nextEl: "#work-samples-swiper-control-button-next",
    prevEl: "#work-samples-swiper-control-button-prev",
  },
  breakpoints: {
    // when window width is >= 977
    977: {
      slidesPerView: "3",
      allowTouchMove: false,
    },
  },
  a11y: {
    prevSlideMessage: "Previous sample",
    nextSlideMessage: "Next sample",
  },
  slideActiveClass: "work-samples-swiper-active-slide",
  loop: true,
  centeredSlides: true,
});

const sections_wrapper = document.querySelector(".content-wrapper");
const section_list = document
  .querySelector(".content-wrapper__content")
  .querySelectorAll("section");
const sidebar_nav_links_list = document
  .querySelector(".content-wrapper__navigation")
  .querySelectorAll(".navigation__item-with-link");
const menu_nav = document.querySelector(".menu-navigation");
const menu_nav_links_list = menu_nav.querySelectorAll(".menu-navigation__item");

let current_section_index = 0;
let touchstartY = 0;
let touchendY = 0;

const throttle = (fn, delay) => {
  let lastCalled = 0;
  return (...args) => {
    let now = new Date().getTime();
    if (now - lastCalled < delay) {
      return;
    }
    lastCalled = now;
    return fn(...args);
  };
};
const move_to_section_throttle = throttle(move_to_section, 800);

function init_fullscreen_scroll() {
  init_fullscreen_content_wrapper();
  init_fullscreen_navigation();
  init_accesible_tab_nav();
}
function init_fullscreen_content_wrapper() {
  //add height limiting class
  sections_wrapper.classList.add("fullscreen-content-wrapper");

  //init content blocks
  for (let i = 0; i < section_list.length; i++) {
    section_list[i].classList.add("fullscreen_section");
  }
  section_list[0].classList.add("fullscreen_section_active");

  //add event listeners for mobile swipe and mouse wheel scroll
  sections_wrapper.addEventListener("wheel", (e) =>
    on_scroll_and_swipe_handler(e.deltaY > 0)
  );
  sections_wrapper.addEventListener("touchstart", (e) => {
    touchstartY = e.changedTouches[0].screenY;
  });
  sections_wrapper.addEventListener("touchend", (e) => {
    touchendY = e.changedTouches[0].screenY;
    swipe_check_direction();
  });
}
function init_fullscreen_navigation() {
  //highlight navigation link corresponding to active conent section
  menu_nav_links_list[current_section_index].classList.add(
    "nav-active-section"
  );
  sidebar_nav_links_list[current_section_index].classList.add(
    "nav-active-section"
  );
  for (let i = 0; i < menu_nav_links_list.length; i++) {
    menu_nav_links_list[i].addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        toggle_menu();
        setTimeout(() => {
          navigation_click_handler(e, i);
        }, 2000);
      },
      destructor
    );
    sidebar_nav_links_list[i].addEventListener(
      "click",
      (e) => {
        navigation_click_handler(e, i);
      },
      destructor
    );
  }
  document
    .querySelector("#open-menu-button")
    .addEventListener("click", toggle_menu);
}
function init_accesible_tab_nav() {

  //disable fullscreen size foe each section  if tab pressed to prevent navigation distortion
  window.addEventListener("keydown", (e) => tab_press_handler(e));
}
function move_to_section(next_section_index) {
  navigation_current_section_handler(next_section_index);
  section_list[current_section_index].classList.remove(
    "fullscreen_section_active"
  );
  section_list[next_section_index].classList.add("fullscreen_section_active");
  current_section_index = next_section_index;
}

function on_scroll_and_swipe_handler(is_shift_forward) {
  if (is_shift_forward) {
    if (current_section_index + 1 > section_list.length - 1) {
      move_to_section_throttle(0);
    } else {
      move_to_section_throttle(current_section_index + 1);
    }
  } else {
    if (current_section_index - 1 < 0) {
      move_to_section_throttle(section_list.length - 1);
    } else {
      move_to_section_throttle(current_section_index - 1);
    }
  }
}
function swipe_check_direction() {
  //switch active conent section after vertical swipe what pass threshold
  const min_swipe_power_threshold = 100;
  if (min_swipe_power_threshold < Math.abs(touchendY - touchstartY)) {
    on_scroll_and_swipe_handler(touchstartY - touchendY > 0);
  }
}
function tab_press_handler(e) {
  if (e.code === "Tab") {
      e.preventDefault();
    //todo on tab press disable all event listers for fullscreenscroll and enable scrollbar
    /* for (let i = 0; i < section_list.length; i++) {
      section_list[i].classList.remove("fullscreen_section");
      if (i === current_section_index) {
        section_list[i].classList.remove("fullscreen_section_active");
      }
    }
    document.querySelector(".wrapper").classList.add("scrollable-wrapper");
    document.removeEventListener(destructor); */
  }
}
function navigation_current_section_handler(next_section_index) {
  menu_nav_links_list[current_section_index].classList.remove(
    "nav-active-section"
  );
  menu_nav_links_list[next_section_index].classList.add("nav-active-section");
  sidebar_nav_links_list[current_section_index].classList.remove(
    "nav-active-section"
  );
  sidebar_nav_links_list[next_section_index].classList.add(
    "nav-active-section"
  );
}
function navigation_click_handler(e, next_section_index) {
  if (current_section_index === next_section_index) {
    return;
  }
  e.preventDefault(e);
  move_to_section_throttle(next_section_index);
}
function toggle_menu() {
  sections_wrapper.classList.toggle("fullscreen-content-wrapper-active");
  menu_nav.classList.toggle("menu-navigation-active");
}

init_fullscreen_scroll();

function destructor() {
  console.log("destroyed");
}
console.log("succ");