function DemoViewModel() {
    this.messages = ['Does this work?', 'Hello world!', 'Nathan Friend'];
    this.message = 'It works!';
}

var nf = new NF(new DemoViewModel());
nf.run();