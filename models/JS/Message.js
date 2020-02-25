class Message{

  constructor(content, sender, type, date){
    this.content = content;
    this.sender = sender;
    this.type = type||"text";
    this.date = date;
  }
}

module.exports = Message;
