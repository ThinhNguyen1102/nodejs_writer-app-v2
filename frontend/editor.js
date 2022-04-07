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
    getDataFromLS: async function () {
      try {
        const dataStream = await fetch("http://localhost:8080/api/note");
        return dataStream;
      } catch (err) {
        console.log(err);
      }
    },
    getContentEdit: async function () {
      const title = $(".title-edit");
      const password = $(".password");
      const btnSubmit = $(".redirect-link.submit");

      if (params.get("edit") === "true") {
        password.classList.add("input-hidden");
        const noteId = params.get("id");

        const dataStream = await fetch(
          `http://localhost:8080/api/note/${noteId}`
        );
        const note = await dataStream.json();

        title.value = note.title;

        setTimeout(() => {
          tinymce.get("myTextarea").setContent(note.content);
          // tinymce.get("myTextarea").getBody().innerHTML = noteEdit.content;
        }, 1);
        btnSubmit.textContent = "Update";
      }
    },
    getText: function () {
      const linkSubmit = $(".redirect-link.submit");

      linkSubmit.addEventListener("click", async function () {
        const title = $(".title-edit");
        const password = $(".password");
        let newNote = {};

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
            password: password.value,
            title: title.value,
            content: tinymce.get("myTextarea").getContent(),
            lastUpdate: new Date().getTime(),
            bookmark: false,
          };

          // noteStorage.push(newNote);
        }

        // localStorage.setItem("notes", JSON.stringify(noteStorage));

        const redirectIndex = document.createElement("a");
        redirectIndex.setAttribute(
          "href",
          `http://127.0.0.1:5500/frontend/index.html`
        );
        document.body.appendChild(redirectIndex);

        // ----------- FETCH API
        try {
          const saveData = await fetch("http://localhost:8080/api/note", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newNote),
          });
          console.log(saveData);
          if (saveData) {
            redirectIndex.click();
          }
        } catch (err) {
          console.log(err);
        }

        // fetch("http://localhost:8080/api/note", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(noteStorage),
        // })
        //   .then((result) => {
        //     console.log(result);
        //   })
        //   .catch((err) => console.log(err));
      });
    },
    cancelEdit: function () {
      const linkCancel = $(".redirect-link.cancel");

      linkCancel.addEventListener("click", function () {
        linkCancel.setAttribute(
          "href",
          // `https://thinhnguyen1102.github.io/writer-web-app/index.html`,
          `http://127.0.0.1:5500/frontend/index.html`
        );
      });
    },
    run: async function () {
      const _this = this;

      noteStorage = await (await _this.getDataFromLS()).json();
      if (noteStorage) {
        _this.getContentEdit();
        _this.getText();
        _this.cancelEdit();
      }
    },
  };
  app.run();
});
