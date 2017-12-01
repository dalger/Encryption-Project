/**
 * @author David Alger II
 */

 'use strict';

$(function(){//On document ready
    var type = 0,
        message = "",
        pass = "",
        key = "";    

    $("#password").change(function(){
        if(type === 0){
            var salt = CryptoJS.lib.WordArray.random(16);
            pass = pass + salt;
            
            $("#sharedKey").text(pass);
        }
        else if(type === 2){
            auth(this.value);
        }
    });

    $("#encrypt").click(function(){
        message = $("#message").val();
        key = $("#sharedKey").text();

        // key = CryptoJS.lib.WordArray.random(16);
        // pass = pass + key;

        // $("#privKey").text(key);
        // $("#sharedKey").text(pass);
        
        if(type === 0){//symmetric 
            var encrypted = CryptoJS.AES.encrypt(message, key);
            $("#result").val(encrypted);
        } else if(type === 1){//asymmetric
            asymmetricCrypto(this.id);
        }
    });

    $("#decrypt").click(function(){
        message = $("#message").val();
        key = $("#sharedKey").text();

        // key = CryptoJS.lib.WordArray.random(16);
        
        if(type === 0){//symmetric 
            var decrypted = CryptoJS.AES.decrypt(message, key);
            $("#result").val(decrypted.toString(CryptoJS.enc.Utf8));
        } else if(type === 1){//asymmetric
            asymmetricCrypto(this.id);
        }
    });

    $("#clear").click(function(){
        $("#message, #result").val("");
    });

    $("#swapEncypted").click(function(){
        var encry = $("#result").val();
        $("#result").val("");
        $("#message").val(encry);
    });

    $("#type").change(function(){
        type = this.selectedIndex;
        if(type === 0){ 
            $("#requirements").text("Please A Enter Password"); 

            $("#pubKey").text("");
            $("#privKey").text("");
            $("#result").val("");
            $("#message").val("");
        }
        else if(type === 1){
            $("#requirements").text("Generating Keys..."); 

            $("#pubKey").text("");
            $("#privKey").text("");
            $("#result").val("");
            $("#message").val("");

            generateKeys();
        }
        else if(type === 2){
            $("#requirements").text("Please A Enter Password"); 
            
            $("#pubKey").text("");
            $("#privKey").text("");
            $("#result").val("");
            $("#message").val("");
        }
    });
    $("#type").trigger("change");



    //asymmetric
  function asymmetricCrypto(fn){
      // Execute when they click the button.
    //   $('#encrypt').click(function () {
  if(fn === "encrypt"){
        // Create the encryption object.
        var crypt = new JSEncrypt();
        // crypt.default_key_size = 2048;
  
        // Set the private.
        crypt.setPrivateKey($('#privKey').text());
        //return;
        // If no public key is set then set it here...
        var pubkey = $('#pubKey').text();
        if (!pubkey) {
          $('#pubKey').text(crypt.getPublicKey());
        }
  
        // Get the input and crypted values.
        var input = $('#message').val();
        // var crypted = $('#result').val();

        $('#result').val(crypt.encrypt(input));
    }
    else if(fn === "decrypt"){
    // });
    // $("decrypt").click(function(){
        // Alternate the values.
        // if (input) {
        //   $('#result').val(crypt.encrypt(input));
        // //   $('#input').val('');
        // }
        // else if (crypted) {
        var crypt = new JSEncrypt();

        crypt.setPrivateKey($('#privKey').text());
        //return;
        // If no public key is set then set it here...
        var pubkey = $('#pubKey').text();
        if (!pubkey) {
          $('#pubKey').text(crypt.getPublicKey());
        }

        var crypted = $('#message').val();
        var decrypted = crypt.decrypt(crypted);
        $('#result').val(decrypted);
        //   $('#crypted').val('');
        // }
    //   });
    }
  
      
  
      // If they wish to generate new keys.
    //   $('#type').change(generateKeys);
    //   generateKeys();
    };

});

var generateKeys = function () {
    var sKeySize = 1024;
    var keySize = parseInt(sKeySize);
    var crypt = new JSEncrypt({default_key_size: keySize});
    // var async = $('#async-ck').is(':checked');
    var dt = new Date();
    var time = -(dt.getTime());
    crypt.getKey();
    dt = new Date();
    time += (dt.getTime());
    // $('#time-report').text('Generated in ' + time + ' ms');
    var pubkey = crypt.getPublicKey();
    var privkey = crypt.getPrivateKey();
    $('#privKey').text(privkey);//.split("-----")[2].replace(/\n/g, "")
    $('#pubKey').text(pubkey);//.split("-----")[2].replace(/\n/g, "")
};

//https://gist.github.com/billyxs/c9a338b5443d346ff9eb
/**
 * @function auth verifies a signature for validity
 * @param {String} password 
 */
function auth(password) {
    // Make a salt with CryptoJS.lib.WordArray.random(128/8);
    var salt = CryptoJS.lib.WordArray.random(16);

    // 1000 iterations takes a couple seconds in the browser. Wouldn't want to go much higher if this is a browser implementation
    var iterations = 1000;

    // make your own hash if you don't know this one
    var matchHash = CryptoJS.SHA256($("#message").val());//'abc123def456zxy987';

    var userHash = CryptoJS.PBKDF2(password, salt, { keySize: 512/32, iterations: iterations });
    return userHash.toString() === matchHash;
};