window.addEventListener("load", function () {
  const $ = this.document.querySelector.bind(this.document);
  const $$ = this.document.querySelectorAll.bind(this.document);
  const params = new URLSearchParams(window.location.search);

  let noteStorage = [];
  /*
  {
    id: String,
    title: String,
    rawContent: String,
    lastUpdate: Date,
    bookmark: Boolean
  }
  */
  const app = {
    getDataFromLS: function () {
      if (localStorage.getItem("notes")) {
        noteStorage = JSON.parse(localStorage.getItem("notes"));
      }
    },
    getContentEdit: function () {
      const title = $(".title-edit");
      const btnSubmit = $(".redirect-link.submit");
      if (params.get("edit") === "true") {
        const noteEdit = noteStorage.find(
          (item) => item.id === params.get("id")
        );

        title.value = noteEdit.title;

        setTimeout(() => {
          tinymce.get("myTextarea").setContent(noteEdit.content);
          // tinymce.get("myTextarea").getBody().innerHTML = noteEdit.content;
        }, 100);
        btnSubmit.textContent = "Update";
      }
    },
    getText: function () {
      const linkSubmit = $(".redirect-link.submit");

      linkSubmit.addEventListener("click", function () {
        const title = $(".title-edit");
        let newNote;

        if (params.get("edit") === "true") {
          noteStorage.forEach((item) => {
            if (item.id === params.get("id")) {
              item.title = title.value;
              item.content = tinymce.get("myTextarea").getContent();
              item.lastUpdate = new Date().getTime();
            }
            newNote = { ...item };
          });
        } else {
          newNote = {
            id: Math.random() + "",
            title: title.value,
            content: tinymce.get("myTextarea").getContent(),
            lastUpdate: new Date().getTime(),
            bookmark: false,
          };

          noteStorage.push(newNote);
        }

        localStorage.setItem("notes", JSON.stringify(noteStorage));

        linkSubmit.setAttribute(
          "href",
          `https://thinhnguyen1102.github.io/writer-web-app/index.html`
        );
      });
    },
    cancelEdit: function () {
      const linkCancel = $(".redirect-link.cancel");

      linkCancel.addEventListener("click", function () {
        linkCancel.setAttribute(
          "href",
          `https://thinhnguyen1102.github.io/writer-web-app/index.html`
        );
      });
    },
    run: function () {
      const _this = this;
      _this.getDataFromLS();
      _this.getContentEdit();
      _this.getText();
      _this.cancelEdit();
    },
  };
  app.run();
});
