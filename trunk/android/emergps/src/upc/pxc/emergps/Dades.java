package upc.pxc.emergps;

import java.util.ArrayList;

public class Dades {

	String id;
	Float posx, posy;
	String comment;
	ArrayList<Staff> poli = new ArrayList();
	ArrayList<Staff> bomb = new ArrayList();
	ArrayList<Staff> amb = new ArrayList();
	
	public void setDades(String s){
		String[] dat = s.split("&");
		id = dat[0];
		posx = Float.parseFloat(dat[1]);
		posy = Float.parseFloat(dat[2]);
		comment = dat[3];
		poli.clear();
		bomb.clear();
		amb.clear();
		for(int i = 4; i < dat.length; i+=3){
			Staff st = new Staff();
			st.setId(dat[i]);
			st.setPosx(Float.parseFloat(dat[i+1]));
			st.setPosy(Float.parseFloat(dat[i+2]));
			int n = Integer.parseInt(""+dat[i].charAt(0));
			if(n == 1)		poli.add(st);
			else if(n == 2)	bomb.add(st);
			else if(n == 3)	amb.add(st);
		}
	}
	
	public String getId() {
		return id;
	}

	public Float getPosx() {
		return posx;
	}

	public Float getPosy() {
		return posy;
	}

	public String getComment() {
		return comment;
	}

	public ArrayList<Staff> getPolicia() {
		return poli;
	}
	public ArrayList<Staff> getBomber() {
		return bomb;
	}
	public ArrayList<Staff> getAmbulancia() {
		return amb;
	}
	

}


