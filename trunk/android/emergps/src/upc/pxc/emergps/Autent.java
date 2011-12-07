package upc.pxc.emergps;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class Autent extends Activity implements OnClickListener{
	final String TAG = "AUTENT";
	EditText tu, tp;
	Button login;
	private ComService mBoundService;

	private ServiceConnection mConnection = new ServiceConnection() {
	public void onServiceConnected(ComponentName className, IBinder service) {
	    mBoundService = ((ComService.LocalBinder)service).getService();
	}

	public void onServiceDisconnected(ComponentName className) {
	    mBoundService = null;
	}
	};
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.autent);
        
        findViews();
        initService();
       
    }

    private void findViews(){
        tu = (EditText) findViewById(R.id.text_user);
        tp = (EditText) findViewById(R.id.text_pass);
        login = (Button) findViewById(R.id.login_button);
        login.setOnClickListener(this);
    }

	private void initService() {
		doBind();

	}

	
    public void onClick(View v){
		
    	String stu = tu.getText().toString();
    	String stp = tp.getText().toString();
    	
    	Autentif(stu, stp);
    	
    }
    
    Activity activity = this;
    private void Autentif(final String user, final String pass){
    	tu.setText("");
		tp.setText("");
		Toast.makeText(this, "Autentificant...", Toast.LENGTH_SHORT).show();
    	Thread t = new Thread(){
    		public void run(){
    			
    			if(mBoundService.autent(user, pass)){
    				activity.runOnUiThread(new Runnable() {
    				    public void run() {
    				        Toast.makeText(activity, "Benvingut usuari "+ mBoundService.getId(), Toast.LENGTH_SHORT).show();
    				    }
    				});
    				Intent i = new Intent(Autent.this, Menu.class);
    				startActivity(i);
    				finish();
    			} else {
    				activity.runOnUiThread(new Runnable() {
    				    public void run() {
    				        Toast.makeText(activity, "User o pass incorrectes", Toast.LENGTH_SHORT).show();
    				    }
    				});
    			}

    		};
    		
    	
    	};
    	t.start();
    }
   

	
    @Override
    public void onPause(){
    	super.onPause();
    	doUnBind();
    }

    @Override
    public void onResume(){
    	super.onResume();
		doBind();

    	
    }
    @Override
     public void onDestroy(){
    	 super.onDestroy();
    	 doUnBind();
     }

    boolean bind = false;
    private void doBind(){
    	bindService(new Intent(this, ComService.class), mConnection, Context.BIND_AUTO_CREATE);
    	bind = true;
    }
    
    private void doUnBind(){
    	if(bind){
    		unbindService(mConnection);
    	}
    	bind = false;
    }
 
}


