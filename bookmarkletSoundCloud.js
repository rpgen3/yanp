javascript:["tracks","playlists"].map(v=>new RegExp(v+":([0-9]+)")).map(v=>["head","body"].map(e=>document[e].innerHTML.match(v)).filter(v=>v)[0]).filter(v=>v).forEach((v,i,a)=>prompt(`URL(${i+1}/${a.length})`,`https://api.soundcloud.com/${v[0].replace(/:/,'\/')}`))
