
package upc.pxc.emergps;

import android.app.Activity;
import android.os.Bundle;
import android.view.*;
import android.view.View.OnClickListener;
import android.content.Intent;
import android.util.Log;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;
import com.google.android.maps.MyLocationOverlay;
import com.google.android.maps.Overlay;

public class Incidence extends MapActivity {
   private MapView map;
   private MapController controller;

   @Override
   public void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.incidence);
      initMapView();
      initMyLocation();
      initIncidence();
      initSupportStaff();
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
   
   private void initIncidence(){

	   
   }

   private void initSupportStaff(){
	   
	   
   }
   
   @Override
   protected boolean isRouteDisplayed() {
      // Required by MapActivity
      return false;
   }
}





















/*

package upc.pxc.emergps;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.*;
import android.view.View.OnClickListener;
import android.content.Intent;
import android.util.Log;

public class Incidence extends Activity {
	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		setContentView(R.layout.incidence);
		
		
	}
}*/
