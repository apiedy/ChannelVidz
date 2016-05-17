$('document').ready(function(){
    document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady(){
    //Checking local storage for channel
    if (localStorage.channel == null || localStorage.channel == '') {
        //Ask user for channel
        $("#popupDialog").popup("open");
    }
    else{
        var channel = localStorage.getItem('channel');
    }
    getPlaylist(channel);
    $(document).on('click', '#vidlist li',function(){
        showVideo($(this).attr('videoId'));
    });
    $("#channelBtnOk").click(function(){
        var channel = $("#channelName").val();
        setChannel(channel);
        getPlaylist(channel);
    });
    $("#saveOptions").click(function(){
        saveOptions();
    });
    $("#clearChannel").click(function(){
        clearChannel();
    });
    $(document).on('pageinit', '#options', function(e){
        var channel=localStorage.getItem('channel');
        var maxResults=localStorage.getItem('maxRes');
        $("#channelNameOptions").attr('value',channel);
        $("#maxResultOptions").attr('value',maxResults);
    });
}
function getPlaylist(channel){
    $('#vidlist').html('');
    $.get(
            "https://www.googleapis.com/youtube/v3/channels",
            {
                part: 'contentDetails',
                forUsername: channel,
                key: 'AIzaSyCYEUJk17KSaca8B3LHq-iVV_zmqS5vIXw'
            },
            function(data)
            {
                $.each(data.items, function(i,item){
                    console.log(item);
                    playlistId=item.contentDetails.relatedPlaylists.uploads;
                    getVideos(playlistId, localStorage.getItem('maxRes'));
                });
            }
        );
}
function getVideos(playlistId, maxRes){
    $.get(
            "https://www.googleapis.com/youtube/v3/playlistItems",
            {
                part: 'snippet',
                maxResults: maxRes,
                playlistId: playlistId,
                key: 'AIzaSyCYEUJk17KSaca8B3LHq-iVV_zmqS5vIXw'
            },
            function(data){
                var output;
                $.each(data.items, function(i, item){
                    id= item.snippet.resourceId.videoId;
                    title =item.snippet.title;
                    thumb = item.snippet.thumbnails.default.url;
                    $("#vidlist").append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3></li>');
                    $("#vidlist").listview('refresh');
                });
            }
        );
}
function showVideo(id){
    console.log('showing video '+id);
    $('#logo').hide();
    var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
    $('#showVideo').html(output);
}
function setChannel(channel){
    localStorage.setItem('channel', channel);
    console.log("Channel:"+channel);
}
function setMaxResult(maxRes){
    localStorage.setItem('maxRes', maxRes);
    console.log("Max:"+maxRes);
}
function saveOptions(){
    var channel=$("#channelNameOptions").val();
    setChannel(channel);
    var maxRes=$("#maxResultOptions").val();
    setMaxResult(maxRes);
    $('body').pagecontainer('change', '#main',{options});
    getPlaylist(channel);
}
function clearChannel(){
    localStorage.removeItem('channel');
    $('body').pagecontainer('change', '#main',{options});
    //clearing the vidlist
    $("#vidlist").html('');
    //show popup
    $("#popupDialog").popup('open');
}