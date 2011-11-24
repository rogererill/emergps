package upc.pxc.emergps;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;


import android.app.Activity;
import android.app.Service;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Messenger;
import android.widget.*;
import android.view.*;
import android.view.View.OnClickListener;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.util.Log;

public class Emergps extends Activity{
	
	private ComService mBoundService;

	private ServiceConnection mConnection = new ServiceConnection() {
	public void onServiceConnected(ComponentName className, IBinder service) {
	    mBoundService = ((ComService.LocalBinder)service).getService();
		unbindService(mConnection);
		if(mBoundService.getId() == -1){
			startActivity(new Intent(Emergps.this, Autent.class));
		} else {
			startActivity(new Intent(Emergps.this, Menu.class));
		}

		finish();
	}

	public void onServiceDisconnected(ComponentName className) {
	    mBoundService = null;
	    
	}
	};
	
	@Override
	public void onCreate(Bundle savedInstanceState){
		final String TAG = "EMERGPS";
		super.onCreate(savedInstanceState);
		startService(new Intent(this,ComService.class));
		bindService(new Intent(this, ComService.class), mConnection, Context.BIND_AUTO_CREATE);
		
	}
	
}