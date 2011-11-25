
package upc.pxc.emergps;

import android.app.Activity;
import android.os.Bundle;
import android.os.IBinder;
import android.view.*;
import android.view.View.OnClickListener;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.util.Log;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;
import com.google.android.maps.MyLocationOverlay;
import com.google.android.maps.Overlay;

public class Incidence extends MapActivity {
   private MapView map;
   private MapController controller;
   Dades dat = new Dades();
   
	final String TAG = "INCIDENCE";
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
   public void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.incidence);
      initService();
      initMapView();
      initMyLocation();
   }


   private void initMapView() {
      map = (MapView) findViewById(R.id.map);
      controller = map.getController();
      map.setSatellite(true);
      map.setBuiltInZoomControls(true);
   }

   private void initMyLocation() {
      final MyLocationOverlay overlay = new MyLocationOverlay(this, map);
      overlay.enableMyLocation();
      //overlay.enableCompass(); // does not work in emulator
      overlay.runOnFirstFix(new Runnable() {
         public void run() {
            // Zoom in to current location
            controller.setZoom(8);
            controller.animateTo(overlay.getMyLocation());
         }
      });
      map.getOverlays().add(overlay);
   }
   
   private void updateIncidence(){
	   //TODO  Extreure dat i començar a pintar coses! 
	   
   }

   
   @Override
   protected boolean isRouteDisplayed() {
      // Required by MapActivity
      return false;
   }
   
	private void initService() {
		
		doBind();
		
		doRegister();
        
	}
   
   private BroadcastReceiver myReceiverData = new BroadcastReceiver() {
		
		@Override
		public void onReceive(Context context, Intent intent) {
			Bundle extras = intent.getExtras();
			//int id = extras.getInt();
			String dadesStr = extras.getString(mBoundService.DADES_EXTRA);
			dat.setDades(dadesStr);
			
			updateIncidence();
			
			Log.d(TAG, "REBUT!");
			//TODO POSAR COLORS!!!!!!! AL BOTO SOBRE NOVA INCIDÈNCIA
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
    	IntentFilter filter = new IntentFilter(mBoundService.DADES_FILTER);
    	registerReceiver(myReceiverData, filter);
    	reg = true;
    }
    
    private void doUnRegister(){
    	unregisterReceiver(myReceiverData);
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






















