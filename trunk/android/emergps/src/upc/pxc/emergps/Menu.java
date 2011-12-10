package upc.pxc.emergps;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.os.IBinder;
import android.view.*;
import android.view.View.OnClickListener;
import android.widget.Toast;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.util.Log;

public class Menu extends Activity implements OnClickListener{
	
	final String TAG = "MENU";
	private ComService mBoundService;

	private ServiceConnection mConnection = new ServiceConnection() {
	public void onServiceConnected(ComponentName className, IBinder service) {
	    // This is called when the connection with the service has been
	    // established, giving us the service object we can use to
	    // interact with the service.  Because we have bound to a explicit
	    // service that we know is running in our own process, we can
	    // cast its IBinder to a concrete class and directly access it.
	    mBoundService = ((ComService.LocalBinder)service).getService();
	    // Tell the user about this for our demo.
	    
	}

	
	public void onServiceDisconnected(ComponentName className) {
	    // This is called when the connection with the service has been
	    // unexpectedly disconnected -- that is, its process crashed.
	    // Because it is running in our same process, we should never
	    // see this happen.
	    mBoundService = null;
	    
	}
	};
	
	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		
		View b_report = findViewById(R.id.report_label);
		b_report.setOnClickListener(this);
		View b_incid = findViewById(R.id.incid_label);
		b_incid.setOnClickListener(this);
		//View b_log = findViewById(R.id.log_label);
		//b_log.setOnClickListener(this);
		View b_exit = findViewById(R.id.exit_label);
		b_exit.setOnClickListener(this);
		
        initService();
		
	}

	Activity activity = this;
	@Override
	public void onClick(View v) {
		Intent i;
		switch(v.getId()){
		case(R.id.report_label):

			i = new Intent(this, Report.class);
			startActivity(i);
		break;
		case(R.id.incid_label):

			i = new Intent(this, Incidence.class);
			startActivity(i);
		break;
		//case(R.id.log_label):
		//	i = new Intent(this, Logs.class);
		//	startActivity(i);	
		//break;
		case(R.id.exit_label):
	    	Thread t = new Thread(){
    		public void run(){
    			final int id = mBoundService.getId();
    			if(mBoundService.logout()){
    				activity.runOnUiThread(new Runnable() {
    				    public void run() {
    				        Toast.makeText(activity, "Adéu usuari "+ id, Toast.LENGTH_SHORT).show();
    				    }
    				});
    				finish();
    			} else {
    				activity.runOnUiThread(new Runnable() {
    				    public void run() {
    				        Toast.makeText(activity, "Error al logout", Toast.LENGTH_SHORT).show();
    				    }
    				});
    			}

    		};
    		
    	
    	};
    	
    	//crearDialogoConfirmacion().show();
    	
    	/*if(sortir)*/	t.start();

		break;
		}
		
	}

	boolean sortir = false;
	private Dialog crearDialogoConfirmacion()
	{
	    AlertDialog.Builder builder = new AlertDialog.Builder(this);
	 
	    builder.setTitle("Logout");
	    builder.setMessage("Realment desitja fer logout?");
	    builder.setPositiveButton("Sortir", new DialogInterface.OnClickListener() {
	    	public void onClick(DialogInterface dialog, int which) {
	    		sortir = true;
	    	}
	    	});
	    
	    builder.setNegativeButton("Cancelar", new DialogInterface.OnClickListener() {
	    	public void onClick(DialogInterface dialog, int which) {
	    		sortir = false;
	    	}
	    	});
	 
	    return builder.create();
	}
	
	private void initService() {
		
		doBind();
		
		doRegister();
        
	}
	
    private BroadcastReceiver myReceiverPos = new BroadcastReceiver() {
		
		@Override
		public void onReceive(Context context, Intent intent) {
			//Bundle extras = intent.getExtras();
			//int id = extras.getInt();
			//Log.d(TAG, "REBUT!");
		}
	};
	
    @Override
    public void onPause(){
    	super.onPause();
    	doUnBind();
    	doUnRegister();
    }

    @Override
    public void onResume(){
    	super.onResume();
		doBind();
		doRegister();
    	
    }
    @Override
     public void onDestroy(){
    	 super.onDestroy();
    	 doUnBind();
    	 //doUnRegister();
     }

    boolean reg = false;
    private void doRegister(){
    	IntentFilter filter = new IntentFilter(mBoundService.POS_FILTER);
    	registerReceiver(myReceiverPos, filter);
    	reg = true;
    }
    
    private void doUnRegister(){
    	unregisterReceiver(myReceiverPos);
    	reg = false;
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