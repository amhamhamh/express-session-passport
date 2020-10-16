module.exports = {
    isOwner:function(request, response) {
        if (request.user) {
            return true;
        } else {
            return false;
        }
    },
    statusUI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">login</a>'
        if (this.isOwner(request, response)) {                  // 해당인자가 isOwner의 영향을 받아서 작동함. 
            authStatusUI = `${request.user} | <a href="/auth/logout">logout</a>`; //nickname 변수로 들어가고 logout 버튼이 생성이 됨.
        }
        return authStatusUI;
    }
}