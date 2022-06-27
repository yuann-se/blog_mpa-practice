// MAIN PAGE

let articlesListData;
let totalPages;
async function getArticlesListData() {
  const pageParams = new URLSearchParams(window.location.search);
  const page = pageParams.get("page");
  const response = await fetch(
    `https://gorest.co.in/public-api/posts?page=${page}`
  );
  const data = await response.json();
  articlesListData = data.data;
  totalPages = data.meta.pagination.pages;
}

async function createArticlesList() {
  if (document.querySelector(".list-group")) {
    document.querySelector(".list-group").remove();
  }

  const articlesListElement = document.createElement("div");
  articlesListElement.classList.add("list-group", "mb-3");
  document.querySelector(".container").append(articlesListElement);

  await getArticlesListData();

  articlesListData.forEach((article) => {
    let listItem = document.createElement("a");
    listItem.style.cursor = "pointer";
    articlesListElement.append(listItem);
    listItem.classList.add("list-group-item", "list-group-item-action");
    listItem.setAttribute("href", `post.html?id=${article.id}`);
    listItem.textContent = article.title;
  });
}

function createMainPage() {
  const container = document.createElement("div");
  container.classList.add("container", "p-5");
  document.body.append(container);

  const pagination = document.createElement("ul");
  pagination.classList.add("pagination", "justify-content-center");
  for (let i = 0; i < 5; ++i) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    const pageLink = document.createElement("a");
    pageLink.classList.add("page-link");
    pageItem.append(pageLink);
    pagination.append(pageItem);
  }

  container.append(pagination);

  let pageLinks = document.querySelectorAll(".page-link");
  // Строка для проверки работы пагинации
  // totalPages = 5;

  const pagPrev = pageLinks[0];
  const pagNext = pageLinks[4];
  const pagLeft = pageLinks[1];
  const pagCenter = pageLinks[2];
  const pagRight = pageLinks[3];
  pagPrev.innerHTML = "&laquo;";
  pagNext.innerHTML = "&raquo;";
  pagLeft.textContent = 1;
  pagLeft.setAttribute("href", "index.html");
  pagCenter.textContent = 2;
  pagCenter.setAttribute("href", "index.html?page=2");
  pagRight.textContent = 3;
  pagRight.setAttribute("href", "index.html?page=3");

  const pageParams = new URLSearchParams(window.location.search);
  const page = Number(pageParams.get("page"));

  if (!page) {
    pagLeft.closest("li").classList.add("active");
    pagPrev.classList.add("disabled");
  } else if (page === totalPages) {
    pagNext.classList.add("disabled");
    pagRight.textContent = page;
    pagRight.setAttribute("href", `index.html?page=${page}`);
    pagRight.closest("li").classList.add("active");
    pagLeft.textContent = page - 2;
    pagLeft.setAttribute("href", `index.html?page=${page - 2}`);
    pagCenter.textContent = page - 1;
    pagCenter.setAttribute("href", `index.html?page=${page - 1}`);
  } else {
    pagCenter.textContent = page;
    pagCenter.setAttribute("href", `index.html?page=${page}`);
    pagCenter.closest("li").classList.add("active");
    pagLeft.textContent = page - 1;
    if (page === 2) {
      pagLeft.setAttribute("href", `index.html`);
    } else {
      pagLeft.setAttribute("href", `index.html?page=${page - 1}`);
    }
    pagRight.textContent = page + 1;
    pagRight.setAttribute("href", `index.html?page=${page + 1}`);
  }

  pagNext.addEventListener("click", () => {
    if (!pagNext.classList.contains("disabled")) {
      if (!page) {
        window.location = `index.html?page=2`;
      } else {
        window.location = `index.html?page=${page + 1}`;
      }
    }
  });

  pagPrev.addEventListener("click", () => {
    if (!pagPrev.classList.contains("disabled")) {
      if (page === 2 || !page) {
        window.location = `index.html`;
      } else {
        window.location = `index.html?page=${page - 1}`;
      }
    }
  });
}


// POST
let postData;
let commentsData;
async function getPostData() {
  const pageParams = new URLSearchParams(window.location.search);
  const id = pageParams.get("id");

  let response = await fetch(`https://gorest.co.in/public-api/posts/${id}`);
  let data = await response.json();
  postData = data.data;

  response = await fetch(
    `https://gorest.co.in/public-api/comments?post_id=${id}`
  );
  data = await response.json();
  commentsData = data.data;
}

async function createPostPage() {
  const container = document.createElement("div");
  container.classList.add("container", "p-5");
  document.body.append(container);

  await getPostData();

  const title = document.createElement("h1");
  title.textContent = postData.title;
  title.classList.add("h3", "mb-3", "bg-light", "p-3");
  container.append(title);

  const content = document.createElement("p");
  content.textContent = postData.body;
  content.classList.add("mb-4", "border", "p-3", "lead");
  container.append(content);

  const commentsList = document.createElement("ul");
  commentsList.classList.add("list-group");
  commentsData.forEach((el) => {
    const comment = document.createElement("li");
    comment.classList.add("list-group-item");
    const commName = document.createElement("p");
    commName.classList.add("font-italic");
    commName.textContent = el.name;
    const commContent = document.createElement("p");
    commContent.innerHTML = `&#171; ${el.body} &#187;`;
    comment.append(commName, commContent);
    commentsList.append(comment);
  });
  container.append(commentsList);
}
