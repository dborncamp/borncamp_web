var type = {
  theta: 0,
  velocity: 0,
  angle: 0,
  m_a: 0,
  m_b: 0,
  size: 0,
  type: 0,
  temperature: 0,
  brightness: 0,
  position: [3, 5]
}

var particle ={
  _particles: Array(5).fill(type),
  setParticles: function(){
    var i0 = 0;
    var i1 = 2;
    this._stars = this._particles.slice(i0, i1);
    this._stars.map(function(s){s.size=3;});
    this._stars.map(function(t){t.type=0;});
    console.log(this._stars);
  }
}


window.addEventListener("load", function() {
  console.log("Hello World!");
  par = particle;
  par.setParticles();
  a=2;
  console.log(par);
  console.log("Hello Again!");
});
