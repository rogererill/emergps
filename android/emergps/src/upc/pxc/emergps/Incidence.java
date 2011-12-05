
package upc.pxc.emergps;

import java.util.List;


import android.app.Activity;
import android.location.Location;
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

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;
import com.google.android.maps.MyLocationOverlay;
import com.google.android.maps.Overlay;

public class Incidence extends MapActivity {
	
	static final int VAL_INCID = 0;
	static final int VAL_POL = 1;
	static final int VAL_BOMB = 2;
	static final int VAL_AMB = 3;
	
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
      //initMyLocation();
      

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
		List<Overlay> capas = map.getOverlays();

		// PINTEM INCID
		OverlayMapa incid = new OverlayMapa(VAL_INCID, dat.getPosx(), dat.getPosy());
		capas.add(incid);
		
		// PINTEM POLICIA
		for(int i = 0; i < dat.getPolicia().size(); i++){
			OverlayMapa pol = new OverlayMapa(VAL_POL, dat.getPolicia().get(i).getPosx(), dat.getPolicia().get(i).getPosy());
			capas.add(pol);
			Log.d("POLICIA", "Afegir");
		}
		
		// PINTEM BOMB
		for(int i = 0; i < dat.getBomber().size(); i++){
			OverlayMapa bomb = new OverlayMapa(VAL_BOMB, dat.getBomber().get(i).getPosx(), dat.getBomber().get(i).getPosy());
			capas.add(bomb);
			Log.d("BOMBER", "Afegir");
		}
		
		// PINTEM AMB
		for(int i = 0; i < dat.getAmbulancia().size(); i++){
			OverlayMapa amb = new OverlayMapa(VAL_AMB, dat.getAmbulancia().get(i).getPosx(), dat.getAmbulancia().get(i).getPosy());
			capas.add(amb);
			Log.d("AMBULANCIA", "Afegir");
		}
		
		map.postInvalidate();
	   
		
		// DIBUIXAR RUTA!
		
		

		
		
		// TODO TEMPROAL!
	      GeoPoint p = LocToGeopoint(mBoundService.getLoc());
	      controller.setCenter(p);
		
   }

   
   // TODO SEGURAMENT NO FUNCIONA BÉ!!
   private GeoPoint LocToGeopoint(Location l){
	      GeoPoint p = new GeoPoint((int)Math.round(l.getLongitude()*1000000), (int)Math.round(l.getLatitude()*1000000));
	      return p;
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
			//int id = extras.getInt(); FI INCIDENCIA
			
			// TODO
			String dadesStr = extras.getString(mBoundService.DADES_EXTRA);
			//String dadesStr = "0&2.12354&41.42164&Atracament amb pistoles&12345&2.164607&41.424789&10045&0.0&0.0&10090&-122.084095&37.422005";
			dat.setDades(dadesStr);
			
			updateIncidence();
			
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






















