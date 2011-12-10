
package upc.pxc.emergps;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;


import android.app.Activity;
import android.location.Location;
import android.os.Bundle;
import android.os.IBinder;
import android.view.*;
import android.view.View.OnClickListener;
import android.widget.Toast;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.graphics.Color;
import android.util.Log;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;
import com.google.android.maps.MyLocationOverlay;
import com.google.android.maps.Overlay;

public class Incidence extends MapActivity implements OnClickListener {
	
	static final int VAL_POS = 0;
	static final int VAL_INCID = 1;
	static final int VAL_POL = 2;
	static final int VAL_BOMB = 3;
	static final int VAL_AMB = 4;
	
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
   
	View b_report;
   @Override
   public void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.incidence);
      
		b_report = findViewById(R.id.fi_incid);
		b_report.setOnClickListener(this);
		b_report.setEnabled(false);
		
      initService();
      initMapView();
      //initMyLocation();
      

   }

   private void initMapView() {
      map = (MapView) findViewById(R.id.map);
      controller = map.getController();
      map.setSatellite(true);
      map.setBuiltInZoomControls(true);
      controller.setZoom(13);
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
		capas.clear();
		
		

		
		// PINTEM POLICIA
		for(int i = 0; i < dat.getPolicia().size(); i++){
			OverlayMapa pol = new OverlayMapa(VAL_POL, dat.getPolicia().get(i).getPosx(), dat.getPolicia().get(i).getPosy());
			capas.add(pol);
			//Log.d("POLICIA", Double.toString(dat.getPolicia().get(i).getPosx()) + " - " + Double.toString(dat.getPolicia().get(i).getPosy()));
		}
		
		// PINTEM BOMB
		for(int i = 0; i < dat.getBomber().size(); i++){
			OverlayMapa bomb = new OverlayMapa(VAL_BOMB, dat.getBomber().get(i).getPosx(), dat.getBomber().get(i).getPosy());
			capas.add(bomb);
			//Log.d("BOMBER", "Afegir");
		}
		
		// PINTEM AMB
		for(int i = 0; i < dat.getAmbulancia().size(); i++){
			OverlayMapa amb = new OverlayMapa(VAL_AMB, dat.getAmbulancia().get(i).getPosx(), dat.getAmbulancia().get(i).getPosy());
			capas.add(amb);
			//Log.d("AMBULANCIA", "Afegir");
		}
		
		// PINTEM INCID
		OverlayMapa incid = new OverlayMapa(VAL_INCID, dat.getPosx(), dat.getPosy());
		capas.add(incid);
		
		// PINTEM POS
		OverlayMapa pos = new OverlayMapa(VAL_POS, mBoundService.getLoc().getLongitude(), mBoundService.getLoc().getLatitude());
		capas.add(pos);
	
		// DIBUIXAR RUTA!
		try{
			GeoPoint gp = new GeoPoint((int)(dat.getPosy()*1000000),(int)Math.round(dat.getPosx()*1000000));
			DrawPath(LocToGeopoint(mBoundService.getLoc()),gp, Color.GREEN, map);
		} catch (Exception e){
			Log.d("DRAW ROUTE", "ERROR!");
		}
		
	      GeoPoint p = LocToGeopoint(mBoundService.getLoc());
	      controller.setCenter(p);
	      map.postInvalidate();
   }

   
   private GeoPoint LocToGeopoint(Location l){
	      GeoPoint p = new GeoPoint((int)Math.round(l.getLatitude()*1000000), (int)Math.round(l.getLongitude()*1000000));
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
			b_report.setEnabled(true);
			
			Bundle extras = intent.getExtras();
			//int id = extras.getInt(); FI INCIDENCIA
			
			
			String dadesStr = extras.getString(mBoundService.DADES_EXTRA);
			dat = new Dades();
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
    
    
    
    
    private void DrawPath(GeoPoint src,GeoPoint dest, int color, MapView mMapView01) 
    { 
    // connect to map web service 
    StringBuilder urlString = new StringBuilder(); 
    urlString.append("http://maps.google.com/maps?f=d&hl=en"); 
    urlString.append("&saddr=");//from 
    urlString.append( Double.toString((double)src.getLatitudeE6()/1.0E6 )); 
    urlString.append(","); 
    urlString.append( Double.toString((double)src.getLongitudeE6()/1.0E6 )); 
    urlString.append("&daddr=");//to 
    urlString.append( Double.toString((double)dest.getLatitudeE6()/1.0E6 )); 
    urlString.append(","); 
    urlString.append( Double.toString((double)dest.getLongitudeE6()/1.0E6 )); 
    urlString.append("&ie=UTF8&0&om=0&output=kml"); 
    //Log.d("xxx","URL="+urlString.toString()); 
    // get the kml (XML) doc. And parse it to get the coordinates(direction route). 
    Document doc = null; 
    HttpURLConnection urlConnection= null; 
    URL url = null; 
    try 
    { 
    url = new URL(urlString.toString()); 
    urlConnection=(HttpURLConnection)url.openConnection(); 
    urlConnection.setRequestMethod("GET"); 
    urlConnection.setDoOutput(true); 
    urlConnection.setDoInput(true); 
    urlConnection.connect(); 

    
    DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance(); 
    DocumentBuilder db = dbf.newDocumentBuilder(); 
    doc = db.parse(urlConnection.getInputStream()); 

    if(doc.getElementsByTagName("GeometryCollection").getLength()>0) 
    { 
    //String path = doc.getElementsByTagName("GeometryCollection").item(0).getFirstChild().getFirstChild().getNodeName(); 
    String path = doc.getElementsByTagName("GeometryCollection").item(0).getFirstChild().getFirstChild().getFirstChild().getNodeValue() ; 
    //Log.d("xxx","path="+ path); 
    String [] pairs = path.split(" "); 
    String[] lngLat = pairs[0].split(","); // lngLat[0]=longitude lngLat[1]=latitude lngLat[2]=height 
    // src 
    GeoPoint startGP = new GeoPoint((int)(Double.parseDouble(lngLat[1])*1E6),(int)(Double.parseDouble(lngLat[0])*1E6)); 
    mMapView01.getOverlays().add(new CamiOverlay(startGP,startGP,1)); 
    GeoPoint gp1; 
    GeoPoint gp2 = startGP; 
    for(int i=1;i<pairs.length;i++) // the last one would be crash 
    { 
    lngLat = pairs[i].split(","); 
    gp1 = gp2; 
    // watch out! For GeoPoint, first:latitude, second:longitude 
    gp2 = new GeoPoint((int)(Double.parseDouble(lngLat[1])*1E6),(int)(Double.parseDouble(lngLat[0])*1E6)); 
    mMapView01.getOverlays().add(new CamiOverlay(gp1,gp2,2,color)); 
    //Log.d("xxx","pair:" + pairs[i]); 
    } 
    mMapView01.getOverlays().add(new CamiOverlay(dest,dest, 3)); // use the default color 
    } 
    } 
    catch (MalformedURLException e) 
    { 
    e.printStackTrace(); 
    } 
    catch (IOException e) 
    { 
    e.printStackTrace(); 
    } 
    catch (ParserConfigurationException e) 
    { 
    e.printStackTrace(); 
    } 
    catch (SAXException e) 
    { 
    e.printStackTrace(); 
    } 
    }

    Activity activity = this;
	@Override
	public void onClick(View v) {
		Intent i;
		switch(v.getId()){
		
		case(R.id.fi_incid):
	    	Thread t = new Thread(){
    		public void run(){
    			
    			if(mBoundService.fiIncid()){
    				
    				activity.runOnUiThread(new Runnable() {
    				    public void run() {
    				        Toast.makeText(activity, "Incidència finalitzada", Toast.LENGTH_SHORT).show();
    				        b_report.setEnabled(false);
    				    }
    				});
    				finish();
    			} else {
    				activity.runOnUiThread(new Runnable() {
    				    public void run() {
    				        Toast.makeText(activity, "Error al finalitzar", Toast.LENGTH_SHORT).show();
    				    }
    				});
    			}

    		};
    		
    	
    	};
    	t.start();

		break;
		}
		
	}
    
}























