window.addEventListener("load", function () {
  const $ = this.document.querySelector.bind(this.document);
  const $$ = this.document.querySelectorAll.bind(this.document);
  let noteStorage = [];

  const app = {
    getDataFromLS: async function () {
      try {
        //-------------------------- FETCH API
        const dataStream = await fetch("http://localhost:8080/api/note");
        return dataStream;
      } catch (err) {
        console.log(err);
      }
    },
    renderNoteFromLS: function () {
      const tabContents = [...$$(".tab-content")];
      tabContents.forEach((item) => {
        let child = item.lastElementChild;

        while (child) {
          item.removeChild(child);

          child = item.lastElementChild;
        }
      });

      noteStorage.sort(function (a, b) {
        return b.lastUpdate - a.lastUpdate;
      });
      noteStorage.forEach((item) => {
        const date = new Date(item.lastUpdate).toLocaleString("vi-VI");
        const tabContents = [...$$(".tab-content")];

        const isBookmark = item.bookmark ? "is-active" : "";
        const noteHtml = `<div class="note-wrapper" data-id="${item.id}">
                <div class="note-wrapper__left">
                  <div class="note-header">
                    <div class="note-header__left">
                      <i class="fas fa-circle"></i>
                      <h5>${item.title}</h5>
                    </div>
                    <div
                      class="note-header__right icon-list"
                      data-id="${item.id}"
                    >
                      <a class="link-item bookmark">
                        <i class="fas fa-star icon-item bookmark ${isBookmark}"></i>
                      </a>
                      <a class="link-item edit">
                        <i class="fas fa-edit icon-item edit"></i>
                      </a>
                      <a class="link-item download">
                        <i
                          class="fas fa-arrow-alt-circle-down icon-item download"
                        >
                        </i>
                      </a>
                      <a class="link-item view">
                        <i class="fas fa-eye icon-item view"></i>
                      </a>
                      <a class="link-item remove">
                        <i class="fas fa-times-circle icon-item remove"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="note-wrapper__right">
                  <div class="note-date">
                    <div class="note-date__header">
                      <h5>Last update</h5>
                    </div>
                    <div class="note-date__content">
                      <p>${date}</p>
                    </div>
                  </div>
                </div>
              </div>`;

        tabContents.forEach((node) => {
          if (node.getAttribute("data-tab") === "1") {
            node.insertAdjacentHTML("beforeend", noteHtml);
          }
          if (node.getAttribute("data-tab") === "2" && item.bookmark) {
            node.insertAdjacentHTML("beforeend", noteHtml);
          }
        });
      });
    },
    switchTabNote: function (renderNoteFromLS) {
      const tabHeaders = [...$$(".tab-item")];
      const tabContents = [...$$(".tab-content")];

      tabHeaders.forEach((item) => {
        item.addEventListener("click", function (e) {
          renderNoteFromLS();
          e.target.classList.add("is-active");

          const numTab = e.target.dataset.tab;
          tabContents.forEach((item) => {
            if (item.dataset.tab === numTab) {
              item.classList.add("is-active");
            } else {
              item.classList.remove("is-active");
            }
          });

          tabHeaders.forEach((item) => {
            if (item !== e.target) {
              item.classList.remove("is-active");
            }
          });
        });
      });
    },
    openTextEditor: function (isEdit, noteId, a_node) {
      if (isEdit) {
        a_node.setAttribute(
          "href",
          // `https://thinhnguyen1102.github.io/writer-web-app/text-edit.html?edit=true&id=${noteId}`
          `http://127.0.0.1:5500/frontend/text-edit.html?edit=true&id=${noteId}`
        );
      } else {
        a_node.setAttribute(
          "href",
          // `https://thinhnguyen1102.github.io/writer-web-app/text-edit.html?edit=false`
          `http://127.0.0.1:5500/frontend/text-edit.html?edit=false`
        );
      }
    },
    featureHandle: async function (
      openTextEditor,
      dowloadNote,
      viewNote,
      renderNoteFromLS
    ) {
      document.addEventListener("click", async function (e) {
        if (e.target.matches(".new-note")) {
          openTextEditor(false, null, e.target);
        }
        if (e.target.matches(".link-item.edit")) {
          const noteId = e.target.parentNode.getAttribute("data-id");
          openTextEditor(true, noteId, e.target);
        }
        if (e.target.matches(".link-item.bookmark")) {
          const noteId = e.target.parentNode.getAttribute("data-id");
          const dataStream = await fetch(
            `http://localhost:8080/api/note/${noteId}`
          );
          const note = await dataStream.json();

          note.bookmark =
            note.bookmark === true
              ? (note.bookmark = false)
              : (note.bookmark = true);

          e.target.firstElementChild.classList.toggle("is-active");

          //-------------------------- FETCH API
          try {
            const saveData = await fetch("http://localhost:8080/api/note", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(note),
            });

            console.log(saveData);
          } catch (err) {
            console.log(err);
          }

          // ------------- then - catch
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

          // const tabContents = [...$$(".tab-content")];
          // tabContents.forEach((node) => {
          //   if (node.getAttribute("data-tab") === "2" && item.bookmark) {
          //     // document.body.insertAdjacentElement()
          //   }
          // });
        }
        if (e.target.matches(".link-item.download")) {
          const noteId = e.target.parentNode.getAttribute("data-id");
          dowloadNote(noteId);
        }
        if (e.target.matches(".link-item.view")) {
          const noteId = e.target.parentNode.getAttribute("data-id");
          viewNote(noteId);
        }
        if (e.target.matches(".cancel-wrapper")) {
          document.body.removeChild(e.target.parentNode.parentNode);
        }
        if (e.target.matches(".cancel-btn")) {
          document.body.removeChild(e.target.parentNode.parentNode.parentNode);
        }
        if (
          e.target.matches(".view-overlay") ||
          e.target.matches(".alert-overlay")
        ) {
          document.body.removeChild(e.target);
        }
        if (e.target.matches(".link-item.remove")) {
          const noteId = e.target.parentNode.getAttribute("data-id");
          const dataStream = await fetch(
            `http://localhost:8080/api/note/${noteId}`
          );
          const note = await dataStream.json();
          const lastUpdate = new Date(note.lastUpdate).toLocaleString("vi-VI");

          const alertRemoveHtml = `<div class="alert-overlay">
            <div class="alert-wrapper">
              <div class="warning-box">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="content-wrapper">
                <div class="content-wrapper">${note.title}</div>
                <div class="last-update-wrapper">${lastUpdate}</div>
              </div>
              <div class="button-box">
                <button class="btn-item delele-btn" data-id="${noteId}">Delele</button>
                <button class="btn-item cancel-btn">Cancel</button>
              </div>
            </div>
          </div>`;

          document.body.insertAdjacentHTML("beforeend", alertRemoveHtml);
        }
        if (e.target.matches(".btn-item.delele-btn")) {
          document.body.removeChild(e.target.parentNode.parentNode.parentNode);
          const noteId = e.target.getAttribute("data-id");
          // ------------------ FETCH API

          try {
            const saveData = await fetch(
              `http://localhost:8080/api/note/${noteId}`,
              {
                method: "DELETE",
              }
            );

            // console.log(saveData);
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

          const notes = [...$$(".note-wrapper")];
          notes.forEach((item) => {
            if (item.getAttribute("data-id") === noteId) {
              item.parentNode.removeChild(item);
            }
          });
        }
      });
    },
    dowloadNote: function (noteId) {
      const note = noteStorage.find((item) => item.id === noteId);
      if (!note) {
        throw new Error("file not found");
      }
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8, " + encodeURIComponent(note.content)
      );
      const filename =
        note.lastUpdate + "-" + note.title.split(" ").join("-") + "";
      element.setAttribute("download", filename);
      document.body.appendChild(element);
      element.click();
    },
    viewNote: async function (noteId) {
      // const note = noteStorage.find((item) => item.id === noteId);
      const dataStream = await fetch(
        `http://localhost:8080/api/note/${noteId}`
      );
      const note = await dataStream.json();

      const lastUpdate = new Date(note.lastUpdate).toLocaleString("vi-VI");
      const viewNodeHtml = `<div class="view-overlay">
        <div class="view-wrapper">
          <div class="cancel-wrapper">
            <i class="fas fa-times cancel"></i>
          </div>
          <div class="title-wrapper">
            <h3>${note.title}</h3>
          </div>
          <div class="content-wrapper">${note.content}</div>
          <div class="last-update-wrapper">${lastUpdate}</div>
        </div>
      </div>`;

      document.body.insertAdjacentHTML("beforeend", viewNodeHtml);
    },
    run: async function () {
      const _this = this;

      noteStorage = await (await _this.getDataFromLS()).json();
      if (noteStorage) {
        console.log(noteStorage);
        _this.switchTabNote(_this.renderNoteFromLS);
        _this.renderNoteFromLS();
        _this.featureHandle(
          _this.openTextEditor,
          _this.dowloadNote,
          _this.viewNote,
          _this.renderNoteFromLS
        );
      }
    },
  };
  app.run();
});
