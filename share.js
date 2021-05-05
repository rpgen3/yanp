(()=>{
    const imgur = window.imgur,
          h = $("<div>").prependTo("#hideArea"),
          btn = $("<button>").appendTo(h).text("共有").on("click",()=>{
              const input = window.inputURL();
              if(!rpgen3.findURL(input).length) return alert("共有する内容がありません。");
              btn.attr("disabled", true);
              imgur.upload(strToImg(input)).then(({ id, dhash, token })=>{
                  makeDeleteBtn(dhash, token);
                  const url = `https://rpgen3.github.io/player/?imgur=${id}`;
                  rpgen3.addInputText(output,{
                      readonly: true,
                      title: "共有用URL",
                      value: url
                  });
                  rpgen3.addInputText(output,{
                      readonly: true,
                      title: "削除用URL",
                      value: url + `&dhash=${dhash}&token=${token}`
                  });
              }).catch(()=>{
                  alert("アップロードできませんでした。");
                  btn.attr("disabled", false).show();
              });
          });
    const output = $("<div>").appendTo(h),
          p = rpgen3.getParam(),
          disabled = b => $("#loadBtn").attr("disabled", b);
    if(p.mylist) {
        disabled(true);
        $.ajax({ url: `mylist/${p.mylist}.txt` })
            .done(d=>{
            makeNewInputURL(d);
            changePageTtl(p.mylist, "sleepy");
        })
            .fail(()=>msg("共有データの読み込みに失敗しました。", true))
            .always(()=>disabled(false));
    }
    else if(p.imgur){
        disabled(true);
        imgur.load(p.imgur).then(img => {
            makeNewInputURL(imgToStr(img));
            if(p.dhash && p.token) makeDeleteBtn(p.dhash, p.token);
            changePageTtl(p.imgur, "yunomi");
        })
            .catch(()=>msg("共有データの読み込みに失敗しました。", true))
            .finally(()=>disabled(false));
    }
    function makeDeleteBtn(dhash, token){
        btn.hide();
        const btn2 = $("<button>").appendTo(output).text("共有停止").on("click", () => {
            btn2.attr("disabled", true);
            imgur.delete({ dhash, token }).then(()=>{
                alert("削除しました。");
                output.empty();
                btn.attr("disabled", false).show();
            }).catch(()=>{
                alert("削除できません。");
                btn2.attr("disabled", false);
            });
        });
    }
    function makeNewInputURL(value){
        $("#hideArea").children().last().remove();
        window.inputURL = rpgen3.addInputText("#hideArea", Object.assign({
            value: value
        }, window.paramInputURL));
    }
    function changePageTtl(ttl, img){
        $("title").text(ttl);
        $('link[rel="icon"]').attr("href",`https://rpgen3.github.io/player/icon/${img}.png`);
    }
})();
