export function advanceMotion(state,target,elapsed,config){
 let remaining=Math.min(Math.max(0,elapsed),1);
 while(remaining>1e-9){const dt=Math.min(remaining,1/120);remaining-=dt;
  for(const [position,velocity] of [['x','vx'],['y','vy']]){
   state[velocity]+=(config.stiffness*(target[position]-state[position])-config.damping*state[velocity])*dt;
   state[position]+=state[velocity]*dt;
  }
  state.active+=(target.active-state.active)*Math.min(1,dt*5);
 }
}
