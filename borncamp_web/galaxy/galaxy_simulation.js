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
  position: [0, 0]
}

var Galaxy = {
        // Eccentricity of the innermost ellipse
        _inner_eccentricity: 0.8,

        // Eccentricity of the outermost ellipse
        _outer_eccentricity: 1.0,

        // Velocity at the innermost core in km/s
        _center_velocity: 30,

        // Velocity at the core edge in km/s
        _inner_velocity: 200,

        // Velocity at the edge of the disk in km/s
        _outer_velocity: 300,

        // Angular offset per parsec
        _angular_offset: 0.019,

        // Inner core radius
        _core_radius: 6000,

        // Galaxy radius
        _galaxy_radius: 15000,

        // The radius after which all density waves must have circular shape
        _distant_radius: 0,

        // Distribution of stars
        _star_distribution: 0.45,

        // Angular velocity of the density waves
        _angular_velocity: 0.000001,

        // Number of stars
        _stars_count: 20000,

        // Number of dust particles
        _dust_count: 1,


        // Number of H-II regions
        _h2_count: 200,
  
        n: this._stars_count + this._dust_count + 2 * this._h2_count,
        _particles: [],

        setParticles: function(){
            console.log(this._dust_count);
            var i0 = 0;
            var i1 = i0 + this._stars_count;
            this._stars = this._particles.slice(i0, i1);
            this._stars.map(function(s){s.size = 3;});
            this._stars.map(function(s){s.type = 0;});

            var i0 = i1;
            var i1 = i0 + this._dust_count;
            this._dust = this._particles.slice(i0, i1);
            this._dust.map(function(d){d.size = 64});
            this._dust.map(function(d){d.type = 1});

            var i0 = i1;
            var i1 = i0 + this._h2_count;
            this._h2a = this._particles.slice(i0, i1);
            this._h2a.map(function(h){h.size = 0});
            this._h2a.map(function(h){h.type = 2});

            var i0 = i1;
            var i1 = i0 + this._h2_count;
            this._h2b = this._particles.slice(i0, i1);
            this._h2b.map(function(h){h.size = 0});
            this._h2b.map(function(h){h.type = 3});
        },
        
        update: function(timestep=100000){
          this._particles.map(function(p){p.theta += p.velocity * timestep});
          
          var P = this._particles;
          var a = P.map(function(p){return p.m_a});
          var b = P.map(function(p){return p.m_b});
          var theta = P.map(function(p){return p.theta});
          var beta = P.map(function(p){return p.angle * -1});

          var alpha = theta * Math.PI / 180.0;
          var cos_alpha = Math.cos(alpha);
          var sin_alpha = Math.sin(alpha);
          var cos_beta = Math.cos(beta);
          var sin_beta = Math.sin(beta);
          P.map(function(p){
            p.position[0] = a*cos_alpha*cos_beta - b*sin_alpha*sin_beta;
            p.position[1] = a*cos_alpha*sin_beta + b*sin_alpha*cos_beta;
          });

          var h2apos = this._h2a.map(function(h){return h.position});
          var h3bpos = this._h2b.map(function(h){return h.position});
          var D = [];
          for (var i=0; i < this._h2_count; i++){
            var xdiff = (h2apos[i][0] - h3bpos[i][0]) ** 2;
            var ydiff = (h2apos[i][1] - h3bpos[i][1]) ** 2;

            D.push(Math.sqrt(xdiff + ydiff));
          }

          var S = D.map(function(d){return ((1000-d)/10) - 50});
          var S = Math.max(...S); 
          this._h2a.map(function(h){h.size = 2.0*S});
          this._h2b.map(function(h){h.size = S/6.0});
        },
        
        init: function(){
          this._dust_count = Math.floor(this._stars_count * .75);
          this._particles = Array(this._stars_count).fill(type);
          // setup the particles initially
          this.setParticles();
          return this;
        }
}.init();