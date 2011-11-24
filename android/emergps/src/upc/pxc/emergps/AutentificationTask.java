package upc.pxc.emergps;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

public class AutentificationTask extends Service implements Runnable {

	private final Emergps emergps;
	private final String user, pass;
	final String TAG = "AutentificationTask";
	
	AutentificationTask(Emergps emergps, String user, String pass){
		this.emergps = emergps;
		this.user = user;
		this.pass = pass;
	}
	
	@Override
	public void run() {
		// TODO Auto-generated method stub
		
		//emergps.resultAutent(autentServer(user,pass));
	}

	private boolean autentServer(String user, String pass){
		
		Log.d(TAG, "Conexió establerta!");
		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(user.equals("abc") && pass.equals("abc"))	return true;
		return false;
	}

	@Override
	public IBinder onBind(Intent arg0) {
		// TODO Auto-generated method stub
		return null;
	}
}
