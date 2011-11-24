package upc.pxc.emergps;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import upc.pxc.emergps.ComService.MyServiceBinder;

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

public class Emergps extends Activity implements OnClickListener{
    /** Called when the activity is first created. */
	final String TAG = "EMERGPS";
	EditText tu, tp;
	Button login;
	
	private ServiceConnection conn;
	private IComService myService;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.autent);
        
        
        initService();
        
        //findViews();
       
        finish();
    }
    
    private void initService(){
    	
    	Log.d(TAG, "initService");
    	Intent serviceIntent = new Intent();
    	serviceIntent.setAction("upc.pxc.emergps.ComService");
    	startService(serviceIntent);

        conn = new ServiceConnection() {

			@Override
			public void onServiceConnected(ComponentName name, IBinder service) {
				// TODO Auto-generated method stub
				myService = (IComService) service;
				
				if(myService.getId() == -1){
					Log.d(TAG, "AUTENT.CLASS");
					Intent i = new Intent(Emergps.this, Autent.class);
					startActivity(i);
			    	Log.d(TAG, "-1");
				} else {
			    	Log.d(TAG, Integer.toString(myService.getId()));
					
				}
				
			}

			@Override
			public void onServiceDisconnected(ComponentName name) {
				// TODO Auto-generated method stub
				
			}

			
        };
    	
        bindService(new Intent(Emergps.this ,ComService.class), conn, Context.BIND_AUTO_CREATE);
        
    }
    
    public void resultAutent(boolean b){
    	if(!b){
    		// ERROR
    		Log.d("FINAL", "REFUSAT!");
    	} else {
    		// ENTRAR! :D
    		Log.d("FINAL", "ACCEPTAT!");
    	}
    	
    }
    
    private void findViews(){
        tu = (EditText) findViewById(R.id.text_user);
        tp = (EditText) findViewById(R.id.text_pass);
        login = (Button) findViewById(R.id.login_button);
        login.setOnClickListener(this);
    }
    
    public void onClick(View v){
    	String stu = tu.getText().toString();
    	String stp = tp.getText().toString();
    	final String TAG = "Autenticació";

    }

    
    
    
    
    
    
    
    
    
    
    
    
}