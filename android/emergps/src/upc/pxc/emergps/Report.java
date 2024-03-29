package upc.pxc.emergps;

import android.app.Activity;
import android.location.Location;
import android.os.Bundle;
import android.os.IBinder;
import android.view.*;
import android.view.View.OnClickListener;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.util.Log;

public class Report extends Activity implements OnClickListener{
	//private Spinner spin;
	private View button;
	private TextView tv;
	private TextView lon, lat;
	private CheckBox checkBox;
	final String TAG = "REPORT";
	
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
		setContentView(R.layout.report);
		initService();
		findViews();
		//setAdapters();


		
	}
	
	private void findViews(){
		//spin = (Spinner) findViewById(R.id.tipus_report);
		button = findViewById(R.id.enviar_report);
		button.setOnClickListener(this);
		
		tv = (TextView) findViewById(R.id.desc_report);
		lon = (TextView)findViewById(R.id.long_report);
		lat = (TextView)findViewById(R.id.lat_report);
        checkBox = (CheckBox) findViewById(R.id.check_report);
        
        checkBox.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
	            mBoundService.posAleatoria(((CheckBox) v).isChecked());
            }
        });
        
        
        
        checkBox.setChecked(false);

		lon.setEnabled(false);
		lat.setEnabled(false);
		
		lon.setText("Espereu..");
		lat.setText("Espereu..");
	}
	/*
	private void setAdapters(){
		ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this, R.array.spin_report, android.R.layout.simple_spinner_item);
		adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
		spin.setAdapter(adapter);
	}*/
	

	
	@Override
	public void onClick(View v) {
		Intent i;
		switch(v.getId()){
		case(R.id.enviar_report):
			Toast.makeText(this, "Enviant incidència...", Toast.LENGTH_SHORT).show();
			Location l = mBoundService.getLoc();
			if(mBoundService.novaIncid(l.getLongitude(), l.getLatitude(), tv.getText().toString())){
				Toast.makeText(this, "Enviada amb exit!", Toast.LENGTH_SHORT).show();
				finish();
			} else {
				Toast.makeText(this, "Error en l'enviament", Toast.LENGTH_SHORT).show();
			}
		break;

		}
		
	}
	
	
	
	
	private void initService() {
		
		doBind();
		
		doRegister();
        
	}
	
    private BroadcastReceiver myReceiverPos = new BroadcastReceiver() {
		
		@Override
		public void onReceive(Context context, Intent intent) {

			lon.setText(Double.toString(mBoundService.getLoc().getLongitude()));
			lat.setText(Double.toString(mBoundService.getLoc().getLatitude()));
			checkBox.setChecked( mBoundService.getAleat());
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